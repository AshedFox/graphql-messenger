import {
    Arg,
    Ctx,
    FieldResolver,
    ID,
    Mutation, Publisher, PubSub,
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

@Resolver(ChatUser)
export class ChatUserResolver {
    @FieldResolver()
    async chat(@Root() chatUser: ChatUser) {
        return await Chat.findOneBy({id: chatUser.chatId});
    }

    @FieldResolver()
    async user(@Root() chatUser: ChatUser) {
        return await User.findOneBy({id: chatUser.userId});
    }

    @UseMiddleware(authMiddleware)
    @Query(() => ChatUser)
    async chatUser(@Arg("userId") userId: string, @Arg("chatId") chatId: string): Promise<ChatUser | null> {
        return await ChatUser.findOneBy({userId, chatId});
    }

    @UseMiddleware(authMiddleware)
    @Query(() => [ChatUser])
    async chatUsers(@Arg("chatId") chatId: string): Promise<ChatUser[]> {
        const chat = await Chat.findOneBy({id: chatId});

        if (!chat) {
            throw new Error("Chat with passed id not found!");
        }

        return await ChatUser.find({where: {chatId}});
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => ChatUser, {nullable: true})
    async joinChat(@Arg("chatId", () => ID) chatId: string, @Ctx() context: MyContext,
                   @PubSub(SubscriptionType.CHAT_JOINED) publish: Publisher<ChatUser>): Promise<ChatUser|null>
    {
        const chatUser = await ChatUser.findOneBy({chatId: chatId, userId: context.req.userId});

        if (!chatUser) {
            const chatUser = await ChatUser.create({chatId: chatId, userId: context.req.userId}).save();
            await publish(chatUser);
            return chatUser;
        } else if (chatUser.status & ChatUserStatus.LEAVED) {
            if (chatUser.userId !== context.req.userId) {
                throw new ForbiddenError("No access!");
            }

            await chatUser.recover();
            await chatUser.save();
            await publish(chatUser);

            return chatUser;
        }

        return null;
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Boolean)
    async leaveChat(@Arg("chatId", () => ID) chatId: string, @Ctx() context: MyContext,
                    @PubSub(SubscriptionType.CHAT_LEAVED) publish: Publisher<ChatUser>): Promise<boolean>
    {
        const chatUserToDelete = await ChatUser.findOneBy({chatId: chatId, userId: context.req.userId});

        if (chatUserToDelete) {
            if (chatUserToDelete.userId !== context.req.userId) {
                throw new ForbiddenError("No access!");
            }

            await chatUserToDelete.softRemove();
            await chatUserToDelete.save();
            await publish(chatUserToDelete);

            return true;
        }

        return false;
    }

    @Subscription(() => ChatUser,{
        topics: SubscriptionType.CHAT_JOINED,
        filter: ({payload, args}: ResolverFilterData<ChatUser, {chatId: string}, {userId: string}>) =>
            payload.chatId === args.chatId
    })
    async chatJoined(@Root() chatUser: ChatUser, @Arg("chatId") chatId: string): Promise<ChatUser> {
        return chatUser;
    }

    @Subscription(() => ChatUser,{
        topics: SubscriptionType.CHAT_LEAVED,
        filter: async ({payload, args}: ResolverFilterData<ChatUser, {chatId: string}, { userId: string }>) =>
            payload.chatId === args.chatId
    })
    async chatLeaved(@Root() chatUser: ChatUser, @Arg("chatId") chatId: string): Promise<ChatUser> {
        return chatUser;
    }
}
