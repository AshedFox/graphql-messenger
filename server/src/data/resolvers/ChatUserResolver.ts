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
    ResolverFilterData,
    Root,
    Subscription,
    UseMiddleware
} from "type-graphql";
import {ChatUser} from "../enitities/ChatUser";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {MyContext} from "../../types/MyContext";
import {Chat} from "../enitities/Chat";
import {User} from "../enitities/User";
import {ChatUserStatus} from "../enitities/ChatUserStatus";
import {ForbiddenError} from "apollo-server-core";
import {SubscriptionType} from "./SubscriptionType";
import {ChatUsersArgs} from "../args/ChatUsersArgs";


@ObjectType()
export class ChatUsersResult {
    @Field(() => [ChatUser])
    chatUsers!: ChatUser[];

    @Field()
    hasMore!: boolean;
}

@Resolver(ChatUser)
export class ChatUserResolver {
    @FieldResolver(() => Chat)
    async chat(@Root() chatUser: ChatUser): Promise<Chat | null> {
        return await Chat.findOne({where: {id: chatUser.chatId}, withDeleted: true});
    }

    @FieldResolver(() => User)
    async user(@Root() chatUser: ChatUser): Promise<User | null> {
        return await User.findOne({where: {id: chatUser.userId}, withDeleted: true});
    }

    @UseMiddleware(authMiddleware)
    @Query(() => ChatUser)
    async chatUser(@Arg("userId", () => ID) userId: string, @Arg("chatId", () => ID) chatId: string): Promise<ChatUser | null> {
        return await ChatUser.findOneBy({userId, chatId});
    }

    @UseMiddleware(authMiddleware)
    @Query(() => ChatUsersResult)
    async chatUsers(@Args() {chatId, count, lastUserId, lastCreatedAt}: ChatUsersArgs): Promise<ChatUsersResult> {
        const chat = await Chat.findOneBy({id: chatId});

        if (!chat) {
            throw new Error("Chat with passed id not found!");
        }

        let queryBuilder = ChatUser.createQueryBuilder("chatUser")
            .where('chatUser.chatId = :chatId', {chatId})

        if (lastCreatedAt && lastUserId) {
            queryBuilder = queryBuilder
                .andWhere('(chatUser.createdAt, chatUser.userId) < (:createdAt, :userId)',
                    {createdAt: lastCreatedAt, userId: lastUserId}
                );
        }

        queryBuilder = queryBuilder
            .take(count)
            .orderBy({
                "chatUser.createdAt": "ASC",
                "chatUser.userId": "ASC",
            });

        const [chatUsers] = await queryBuilder.getManyAndCount();

        return {
            chatUsers,
            hasMore: count === chatUsers.length
        }
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => ChatUser, {nullable: true})
    async joinChat(@Arg("chatId", () => ID) chatId: string, @Ctx() context: MyContext,
                   @PubSub() pubSub: PubSubEngine): Promise<ChatUser | null> {
        const chat = await Chat.findOneBy({id: chatId})

        if (!chat) {
            throw new Error("Chat with passed id not found!");
        }

        const chatUser = await ChatUser.findOne({
            where: {chatId: chatId, userId: context.req.userId},
            withDeleted: true
        });

        if (!chatUser) {
            const chatUser = await ChatUser.create({chatId: chatId, userId: context.req.userId}).save();

            await pubSub.publish(SubscriptionType.CHAT_JOINED, chatUser);
            await pubSub.publish(`${SubscriptionType.CHAT_JOINED_SELF}_${context.req.userId}`, chat);

            return chatUser;
        } else if (chatUser.status & ChatUserStatus.LEAVED) {
            if (chatUser.userId !== context.req.userId) {
                throw new ForbiddenError("No access!");
            }

            await chatUser.recover();
            await chatUser.save();

            await pubSub.publish(SubscriptionType.CHAT_JOINED, chatUser);
            await pubSub.publish(`${SubscriptionType.CHAT_JOINED_SELF}_${context.req.userId}`, chat);

            return chatUser;
        }

        return null;
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Boolean)
    async leaveChat(@Arg("chatId", () => ID) chatId: string, @Ctx() context: MyContext,
                    @PubSub() pubSub: PubSubEngine): Promise<boolean> {
        const chat = await Chat.findOneBy({id: chatId})

        if (!chat) {
            throw new Error("Chat with passed id not found!");
        }

        const chatUserToDelete = await ChatUser.findOneBy({chatId: chatId, userId: context.req.userId});

        if (chatUserToDelete) {
            if (chatUserToDelete.userId !== context.req.userId) {
                throw new ForbiddenError("No access!");
            }

            await chatUserToDelete.softRemove();
            await chatUserToDelete.save();

            await pubSub.publish(SubscriptionType.CHAT_LEAVED, chatUserToDelete);
            await pubSub.publish(`${SubscriptionType.CHAT_LEAVED_SELF}_${context.req.userId}`, chat);

            return true;
        }

        return false;
    }

    @Subscription(() => ChatUser, {
        topics: SubscriptionType.CHAT_JOINED,
        filter: async ({payload, context}: ResolverFilterData<ChatUser, {}, { userId: string }>) => {
            const chatUsers = await ChatUser.find({where: {chatId: payload.chatId}});
            return chatUsers.find(chatUser => chatUser.userId === context.userId) !== null;
        }
    })
    async chatJoined(@Root() chatUser: ChatUser): Promise<ChatUser> {
        return chatUser;
    }

    @Subscription(() => Chat, {
        topics: ({context}: ResolverFilterData<ChatUser, {}, { userId: string }>) => `${SubscriptionType.CHAT_JOINED_SELF}_${context.userId}`,
    })
    async chatJoinedSelf(@Root() chat: Chat): Promise<Chat> {
        return chat;
    }

    @Subscription(() => ChatUser, {
        topics: SubscriptionType.CHAT_LEAVED,
        filter: async ({payload, context}: ResolverFilterData<ChatUser, {}, { userId: string }>) => {
            const chatUsers = await ChatUser.find({where: {chatId: payload.chatId}});
            return chatUsers.find(chatUser => chatUser.userId === context.userId) !== null;
        }
    })
    async chatLeaved(@Root() chatUser: ChatUser): Promise<ChatUser> {
        return chatUser;
    }

    @Subscription(() => Chat, {
        topics: ({context}: ResolverFilterData<ChatUser, {}, { userId: string }>) => `${SubscriptionType.CHAT_LEAVED_SELF}_${context.userId}`,
    })
    async chatLeavedSelf(@Root() chat: Chat): Promise<Chat> {
        return chat;
    }
}
