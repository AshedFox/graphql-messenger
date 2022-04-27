import {
    Arg,
    Args,
    Ctx,
    Field,
    FieldResolver,
    ID,
    Mutation,
    ObjectType,
    Publisher,
    PubSub,
    Query,
    Resolver,
    ResolverFilterData,
    Root,
    Subscription,
    UseMiddleware
} from "type-graphql";
import {Chat} from "../enitities/Chat";
import {AddChatInput} from "../inputs/AddChatInput";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {ChatUser} from "../enitities/ChatUser";
import {MyContext} from "../../types/MyContext";
import {ForbiddenError} from "apollo-server-core";
import {SubscriptionType} from "./SubscriptionType";
import {User} from "../enitities/User";
import {Message} from "../enitities/Message";
import {File} from "../enitities/File";
import {ChatStatus} from "../enitities/ChatStatus";
import {ChatsArgs} from "../args/ChatsArgs";
import {SearchChatsArgs} from "../args/SearchChatsArgs";
import {ChatUserRole} from "../enitities/ChatUserRole";

@ObjectType()
export class ChatsResult {
    @Field(() => [Chat])
    chats!: Chat[];

    @Field()
    hasMore!: boolean;
}

@Resolver(Chat)
export class ChatResolver {
    @FieldResolver(() => User)
    async creator(@Root() chat: Chat): Promise<User | null> {
        return await User.findOne({where: {id: chat.creatorId}, withDeleted: true});
    }

    @FieldResolver(() => [ChatUser])
    async users(@Root() chat: Chat): Promise<ChatUser[]> {
        return await ChatUser.find({where: {chatId: chat.id}});
    }

    @FieldResolver(() => Message, {nullable: true})
    async lastMessage(@Root() chat: Chat): Promise<Message | null> {
        return await Message.findOne({where: {chatId: chat.id}, order: {createdAt: "DESC"}});
    }

    @FieldResolver(() => [Message])
    async messages(@Root() chat: Chat): Promise<Message[]> {
        return await Message.find({where: {chatId: chat.id}, order: {createdAt: "DESC"}});
    }

    @FieldResolver(() => File, {nullable: true})
    async avatar(@Root() chat: Chat): Promise<File | null> {
        return chat.avatarId ? await File.findOneBy({id: chat.avatarId}) : null;
    }

    @UseMiddleware(authMiddleware)
    @Query(() => ChatsResult)
    async searchChats(@Args() {count, lastCreatedAt, lastId, name}: SearchChatsArgs): Promise<ChatsResult> {
        let queryBuilder = Chat.createQueryBuilder("chat");

        if (name) {
            queryBuilder = queryBuilder
                .andWhere('chat.name ILIKE :name', {name: `%${name}%`})
        }

        if (lastCreatedAt && lastId) {
            queryBuilder = queryBuilder.andWhere('(chat.createdAt, chat.id) < (:createdAt, :id)',
                {createdAt: lastCreatedAt, id: lastId}
            );
        }

        if (count !== -1) {
            queryBuilder = queryBuilder.take(count);
        }

        queryBuilder = queryBuilder
            .orderBy({
                "chat.createdAt": "DESC",
                "chat.id": "DESC",
            });

        const [chats] = await queryBuilder.getManyAndCount();

        return {
            chats,
            hasMore: count === chats.length
        };
    }

    @UseMiddleware(authMiddleware)
    @Query(() => ChatsResult)
    async chats(@Args() {count, lastCreatedAt, lastId}: ChatsArgs, @Ctx() context: MyContext): Promise<ChatsResult> {
        let queryBuilder = Chat.createQueryBuilder("chat").innerJoinAndSelect("chat.users", "user")
            .where('user.userId = :userId', {userId: context.req.userId})

        if (lastCreatedAt && lastId) {
            queryBuilder = queryBuilder
                .andWhere('(chat.createdAt, chat.id) < (:createdAt, :id)', {createdAt: lastCreatedAt, id: lastId});
        }

        if (count !== -1) {
            queryBuilder = queryBuilder.take(count);
        }

        queryBuilder = queryBuilder
            .orderBy({
                "chat.createdAt": "DESC",
                "chat.id": "DESC",
            });

        const [chats] = await queryBuilder.getManyAndCount();

        return {
            chats,
            hasMore: count === chats.length
        };
    }

    @UseMiddleware(authMiddleware)
    @Query(() => Chat, {nullable: true})
    async chat(@Arg("id", () => ID) id: string): Promise<Chat | null> {
        return await Chat.findOneBy({id: id});
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Chat)
    async addChat(@Arg("input") addChatInput: AddChatInput, @Ctx() context: MyContext,
                  @PubSub(SubscriptionType.CHAT_ADDED) publish: Publisher<Chat>): Promise<Chat> {
        const chat = await Chat.create({...addChatInput, creatorId: context.req.userId}).save();
        await ChatUser.create({chatId: chat.id, userId: chat.creatorId, role: ChatUserRole.OWNER}).save();
        await publish(chat);
        return chat;
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Chat, {nullable: true})
    async recoverChat(@Arg("id", () => ID) id: string, @Ctx() context: MyContext,
                      @PubSub(SubscriptionType.CHAT_RECOVERED) publish: Publisher<Chat>): Promise<Chat | null> {
        const chatToRecover = await Chat.findOne({where: {id}, withDeleted: true});

        if (chatToRecover && (chatToRecover.status & ChatStatus.DELETED)) {
            if (chatToRecover.creatorId !== context.req.userId) {
                throw new ForbiddenError("No access!");
            }

            await chatToRecover.recover();
            const chat = await chatToRecover.save();
            await publish(chat);
            return chat;
        }

        return null;
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Boolean)
    async removeChat(@Arg("id", () => ID) id: string, @Ctx() context: MyContext,
                     @PubSub(SubscriptionType.CHAT_REMOVED) publish: Publisher<Chat>): Promise<boolean> {
        const chatToDelete = await Chat.findOneBy({id});

        if (chatToDelete) {
            if (chatToDelete.creatorId !== context.req.userId) {
                throw new ForbiddenError("No access!");
            }

            chatToDelete.users = await this.users(chatToDelete);


            await chatToDelete.softRemove()
            await chatToDelete.save();
            await publish(chatToDelete);
            return true;
        }

        return false;
    }

    @Subscription(() => Chat, {
        topics: SubscriptionType.CHAT_ADDED,
        filter: ({
                     payload,
                     context
                 }: ResolverFilterData<Chat, {}, { userId: string }>) => context.userId === payload.creatorId
    })
    async chatAdded(@Root() chat: Chat): Promise<Chat> {
        return chat;
    }


    @Subscription(() => Chat, {
        topics: SubscriptionType.CHAT_REMOVED,
        filter: async ({payload, context}: ResolverFilterData<Chat, {}, { userId: string }>) => {
            const chatUsers: ChatUser[] = payload.users;

            return chatUsers.find(el => el.userId === context.userId) !== null;
        }
    })
    async chatRemoved(@Root() chat: Chat): Promise<Chat> {
        return chat;
    }
}