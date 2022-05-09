import {
    Arg,
    Args,
    Ctx,
    Field,
    FieldResolver,
    ID,
    Mutation,
    ObjectType,
    PubSub,
    PubSubEngine,
    Query,
    Resolver,
    Root,
    Subscription,
    UseMiddleware
} from "type-graphql";
import {Chat} from "../enitities/Chat";
import {AddChatInput} from "../inputs/AddChatInput";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {ChatUser} from "../enitities/ChatUser";
import {MyContext} from "../../types/MyContext";
import {HttpQueryError} from "apollo-server-core";
import {SubscriptionType} from "./SubscriptionType";
import {User} from "../enitities/User";
import {Message} from "../enitities/Message";
import {File} from "../enitities/File";
import {ChatStatus} from "../enitities/ChatStatus";
import {ChatsArgs} from "../args/ChatsArgs";
import {SearchChatsArgs} from "../args/SearchChatsArgs";
import {ChatUserRole} from "../enitities/ChatUserRole";
import {ChatInvite} from "../enitities/ChatInvite";
import {MoreThan} from "typeorm";

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
        return ChatUser.find({where: {chatId: chat.id}, order: {createdAt: "ASC"}});
    }

    @FieldResolver(() => Message, {nullable: true})
    async lastMessage(@Root() chat: Chat): Promise<Message | null> {
        return await Message.findOne({where: {chatId: chat.id}, order: {createdAt: "DESC"}});
    }

    @FieldResolver(() => [Message])
    async messages(@Root() chat: Chat): Promise<Message[]> {
        return await Message.find({
            where: {chatId: chat.id},
            order: {createdAt: "DESC"},
            take: 20
        });
    }

    @FieldResolver(() => [ChatInvite])
    async invites(@Root() chat: Chat): Promise<ChatInvite[]> {
        return await ChatInvite.find({
            where: {chatId: chat.id, expiredAt: MoreThan(new Date()), leftUses: MoreThan(0)},
            order: {expiredAt: "DESC"}
        });
    }

    @FieldResolver(() => File, {nullable: true})
    async avatar(@Root() chat: Chat): Promise<File | null> {
        return chat.avatarId ? await File.findOneBy({id: chat.avatarId}) : null;
    }

    @FieldResolver({nullable: true})
    async lastSeen(@Root() chat: Chat, @Ctx() context: MyContext): Promise<Date | null> {
        try {
            const chatUser = await ChatUser.findOneBy({chatId: chat.id, userId: context.req.userId});

            if (chatUser && chatUser.lastSeen) {
                return chatUser.lastSeen;
            }
            return null;
        } catch (e) {
            return null;
        }
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
    @Query(() => Chat)
    async chat(@Arg("id", () => ID) id: string): Promise<Chat> {
        const chat = await Chat.findOneBy({id: id});

        if (!chat) {
            throw new HttpQueryError(404, "Chat not found");
        }

        return chat;
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Chat)
    async addChat(@Arg("input") addChatInput: AddChatInput, @Ctx() context: MyContext,
                  @PubSub() pubSub: PubSubEngine): Promise<Chat>
    {
        const chat = await Chat.create({...addChatInput, creatorId: context.req.userId}).save();
        await ChatUser.create({chatId: chat.id, userId: context.req.userId, role: ChatUserRole.OWNER}).save();
        await pubSub.publish(`${SubscriptionType.CHAT_ADDED}_${context.req.userId}`, chat);
        return chat;
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Chat)
    async recoverChat(@Arg("id", () => ID) id: string, @Ctx() context: MyContext,
                      @PubSub() pubSub: PubSubEngine): Promise<Chat> {
        const chat = await Chat.findOne({where: {id}, withDeleted: true});

        if (!chat) {
            throw new HttpQueryError(404, "Chat not found");
        }

        if (chat.creatorId !== context.req.userId) {
            throw new HttpQueryError(403, "Forbidden");
        }

        if (!(chat.status & ChatStatus.DELETED)) {
            throw new HttpQueryError(409, "Chat not deleted!");
        }

        await chat.recover();
        await chat.save();
        await pubSub.publish(`${SubscriptionType.CHAT_RECOVERED}_${chat.id}`, chat);
        return chat;
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Boolean)
    async removeChat(@Arg("id", () => ID) id: string, @Ctx() context: MyContext,
                     @PubSub() pubSub: PubSubEngine): Promise<boolean>
    {
        const chat = await Chat.findOne({where: {id}, withDeleted: true});

        if (!chat) {
            throw new HttpQueryError(404, "Chat not found");
        }

        if (chat.creatorId !== context.req.userId) {
            throw new HttpQueryError(403, "Forbidden");
        }

        if (chat.status & ChatStatus.DELETED) {
            throw new HttpQueryError(409, "Chat already deleted");
        }

        await chat.softRemove()
        await chat.save();
        await pubSub.publish(`${SubscriptionType.CHAT_REMOVED}_${chat.id}`, chat);
        return true;
    }

    @Subscription(() => Chat, {
        topics: (data) => `${SubscriptionType.CHAT_ADDED}_${data.args.userId}`,
    })
    async chatAdded(@Root() chat: Chat, @Arg("userId", () => ID) userId: string): Promise<Chat> {
        return chat;
    }

    @Subscription(() => Chat, {
        topics: (data) => `${SubscriptionType.CHAT_UPDATED}_${data.args.chatId}`,
    })
    async chatUpdated(@Root() chat: Chat, @Arg("chatId", () => ID) chatId: string) {
        return chat;
    }

    @Subscription(() => Chat, {
        topics: (data) => `${SubscriptionType.CHAT_RECOVERED}_${data.args.chatId}`
    })
    async chatRecovered(@Root() chat: Chat, @Arg("chatId", () => ID) chatId: string): Promise<Chat> {
        return chat;
    }

    @Subscription(() => Chat, {
        topics: (data) => `${SubscriptionType.CHAT_REMOVED}_${data.args.chatId}`
    })
    async chatRemoved(@Root() chat: Chat, @Arg("chatId", () => ID) chatId: string): Promise<Chat> {
        return chat;
    }

    @Subscription(() => Chat, {
        topics: (data) => `${SubscriptionType.CHAT_JOINED}_${data.args.userId}`,
    })
    async chatJoined(@Root() chat: Chat, @Arg("userId", () => ID) userId: string): Promise<Chat> {
        return chat;
    }

    @Subscription(() => Chat, {
        topics: (data) => `${SubscriptionType.CHAT_LEAVED}_${data.args.userId}`,
    })
    async chatLeaved(@Root() chat: Chat, @Arg("userId", () => ID) userId: string): Promise<Chat> {
        return chat;
    }
}
