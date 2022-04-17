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
import {Message} from "../enitities/Message";
import {AddMessageInput} from "../inputs/AddMessageInput";
import {MyContext} from "../../types/MyContext";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {ForbiddenError} from "apollo-server-core";
import {Chat} from "../enitities/Chat";
import {User} from "../enitities/User";
import {ChatUser} from "../enitities/ChatUser";
import {SubscriptionType} from "./SubscriptionType";

@Resolver(Message)
export class MessageResolver {
    @FieldResolver()
    async replyTo(@Root() message: Message) {
        return await Message.findOneBy({id: message.replyToId});
    }

    @FieldResolver()
    async chat(@Root() message: Message) {
        return await Chat.findOneBy({id: message.chatId});
    }

    @FieldResolver()
    async sender(@Root() message: Message) {
        return await User.findOneBy({id: message.senderId});
    }

    @Query(() => [Message])
    async messages(): Promise<Message[]> {
        return await Message.find({order: {createdAt: "desc"}});
    }

    @Query(() => Message, {nullable: true})
    async message(@Arg("id", () => ID) id: string): Promise<Message|null> {
        return await Message.findOneBy({id});
    }

    @Mutation(() => Message)
    async addMessage(@Arg("input") addMessageInput: AddMessageInput, @Ctx() context: MyContext,
                     @PubSub(SubscriptionType.MESSAGE_ADDED) publish: Publisher<Message>): Promise<Message|null>
    {
        const message = await Message.create({...addMessageInput, senderId: context.req.userId}).save();
        await publish(message);
        return message;
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Message, {nullable: true})
    async recoverMessage(@Arg("id", () => ID) id: string, @Ctx() context: MyContext): Promise<Message|null> {
        const messageToRecover = await Message.findOne({where: {id}, withDeleted: true});

        if (messageToRecover && messageToRecover.deletedAt) {
            if (messageToRecover.senderId !== context.req.userId) {
                throw new ForbiddenError("No access!");
            }

            await messageToRecover.recover();
            return await messageToRecover.save();
        }

        return null;
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Boolean)
    async removeMessage(@Arg("id", () => ID) id: string, @Ctx() context: MyContext,
                        @PubSub(SubscriptionType.MESSAGE_REMOVED) publish: Publisher<Message>): Promise<boolean>
    {
        const messageToDelete = await Message.findOneBy({id});

        if (messageToDelete) {
            if (messageToDelete.senderId !== context.req.userId) {
                throw new ForbiddenError("No access!");
            }

            await messageToDelete.softRemove();
            await messageToDelete.save();
            await publish(messageToDelete);

            return true;
        }

        return false;
    }

    @Subscription(() => Message,{
        topics: SubscriptionType.MESSAGE_ADDED,
        filter: ({payload, args}: ResolverFilterData<Message, {chatId: string}, {userId: string}>) =>
            payload.chatId === args.chatId
    })
    async messageAdded(@Root() message: Message, @Arg("chatId") chatId: string): Promise<Message> {
        return message;
    }

    @Subscription(() => Message,{
        topics: SubscriptionType.MESSAGE_REMOVED,
        filter: ({payload, args}: ResolverFilterData<Message, {chatId: string}, {userId: string}>) =>
            payload.chatId === args.chatId
    })
    async messageRemoved(@Root() message: Message, @Arg("chatId") chatId: string): Promise<Message> {
        return message;
    }
}
