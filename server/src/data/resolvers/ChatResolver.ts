import {
    Arg,
    Ctx,
    FieldResolver,
    ID,
    Mutation, Publisher,
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

@Resolver(Chat)
export class ChatResolver {
    @FieldResolver(() => User)
    async creator(@Root() chat: Chat) {
        return User.findOneBy({id: chat.creatorId});
    }

    @FieldResolver(() => [User])
    async users(@Root() chat: Chat) {
        return ChatUser.find({where: {chatId: chat.id}});
    }

    @FieldResolver(() => [Message])
    async messages(@Root() chat: Chat) {
        return Message.find({where: {chatId: chat.id}});
    }

    @FieldResolver(() => File)
    async avatar(@Root() chat: Chat) {
        return File.findOneBy({id: chat.avatarId});
    }

    @UseMiddleware(authMiddleware)
    @Query(() => [Chat])
    async chats(): Promise<Chat[]> {
        return await Chat.find();
    }

    @UseMiddleware(authMiddleware)
    @Query(() => Chat, {nullable: true})
    async chat(@Arg("id", () => ID) id: string): Promise<Chat|null> {
        return await Chat.findOneBy({id: id});
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Chat)
    async addChat(@Arg("input") addChatInput: AddChatInput, @Ctx() context: MyContext,
                  @PubSub(SubscriptionType.CHAT_ADDED) publish: Publisher<Chat>): Promise<Chat>
    {
        const chat = await Chat.create({...addChatInput, creatorId: context.req.userId}).save();
        await ChatUser.create({chatId: chat.id, userId: chat.creatorId}).save();
        await publish(chat);
        return chat;
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Chat, {nullable: true})
    async recoverChat(@Arg("id", () => ID) id: string, @Ctx() context: MyContext): Promise<Chat | null> {
        const chatToRecover = await Chat.findOne({where: {id}, withDeleted: true});

        if (chatToRecover && (chatToRecover.status & ChatStatus.DELETED)) {
            if (chatToRecover.creatorId !== context.req.userId) {
                throw new ForbiddenError("No access!");
            }

            await chatToRecover.recover();
            return await chatToRecover.save();
        }

        return null;
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Boolean)
    async removeChat(@Arg("id", () => ID) id: string, @Ctx() context: MyContext,
                     @PubSub(SubscriptionType.CHAT_REMOVED) publish: Publisher<Chat>): Promise<boolean>
    {
        const chatToDelete = await Chat.findOneBy({id});

        if (chatToDelete) {
            if (chatToDelete.creatorId !== context.req.userId) {
                throw new ForbiddenError("No access!");
            }

            await chatToDelete.softRemove()
            await chatToDelete.save();
            await publish(chatToDelete);
            return true;
        }

        return false;
    }

    @Subscription(() => Chat,{
        topics: SubscriptionType.CHAT_ADDED,
        filter: ({payload, context}: ResolverFilterData<Chat, {}, {userId: string}>) => context.userId === payload.creatorId
    })
    async chatAdded(@Root() chat: Chat): Promise<Chat> {
        return chat;
    }

    @Subscription(() => Chat,{
        topics: SubscriptionType.CHAT_REMOVED,
        filter: async ({payload, args}: ResolverFilterData<Chat, {chatId: string}, { userId: string }>) => {
            return payload.id === args.chatId;
        }
    })
    async chatRemoved(@Root() chat: Chat, @Arg("chatId") chatId: string): Promise<Chat> {
        return chat;
    }
}
