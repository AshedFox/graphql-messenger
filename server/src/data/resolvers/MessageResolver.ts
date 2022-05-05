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
import {Message} from "../enitities/Message";
import {AddMessageInput} from "../inputs/AddMessageInput";
import {MyContext} from "../../types/MyContext";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {HttpQueryError} from "apollo-server-core";
import {Chat} from "../enitities/Chat";
import {User} from "../enitities/User";
import {SubscriptionType} from "./SubscriptionType";
import {MessagesArgs} from "../args/MessagesArgs";
import {MessageFile} from "../enitities/MessageFile";

@ObjectType()
export class MessagesResult {
    @Field(() => [Message])
    messages!: Message[];

    @Field()
    hasMore!: boolean;
}

@Resolver(Message)
export class MessageResolver {
    @FieldResolver(() => Message, {nullable: true})
    async replyTo(@Root() message: Message): Promise<Message | null> {
        return message.replyToId ? await Message.findOneBy({id: message.replyToId}) : null;
    }

    @FieldResolver(() => Chat)
    async chat(@Root() message: Message): Promise<Chat | null> {
        return await Chat.findOneBy({id: message.chatId});
    }

    @FieldResolver(() => User)
    async sender(@Root() message: Message): Promise<User | null> {
        return await User.findOneBy({id: message.senderId});
    }

    @FieldResolver(() => [MessageFile])
    async attachments(@Root() message: Message): Promise<MessageFile[]> {
        return await MessageFile.find({where: {messageId: message.id}});
    }


    @Query(() => MessagesResult)
    async messages(@Args() {count, chatId, lastId, lastCreatedAt}: MessagesArgs): Promise<MessagesResult> {
        let queryBuilder = Message.createQueryBuilder("message")
            .where("message.chatId = :chatId", {chatId});

        if (lastCreatedAt && lastId) {
            queryBuilder = queryBuilder
                .andWhere('(message.createdAt, message.id) < (:createdAt, :id)', {createdAt: lastCreatedAt, id: lastId})
        }

        if (count !== -1) {
            queryBuilder = queryBuilder.take(count);
        }

        queryBuilder = queryBuilder
            .orderBy({
                "message.createdAt": "DESC",
                "message.id": "DESC",
            })

        const [messages] = await queryBuilder.getManyAndCount();

        return {
            messages,
            hasMore: count === messages.length
        };
    }

    @Query(() => Message)
    async message(@Arg("id", () => ID) id: string): Promise<Message> {
        const message = await Message.findOneBy({id});

        if (!message) {
            throw new HttpQueryError(404, "Message not found")
        }

        return message;
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Message)
    async addMessage(@Arg("input") addMessageInput: AddMessageInput, @Ctx() context: MyContext,
                     @PubSub() pubSub: PubSubEngine): Promise<Message> {
        const chat = await Chat.findOneBy({id: addMessageInput.chatId})

        if (!chat) {
            throw new HttpQueryError(404, "Chat not found");
        }

        const message = await Message.create({
            ...addMessageInput,
            senderId: context.req.userId,
        });
        await message.save();
        await MessageFile.insert(addMessageInput.attachmentsIds.map(fileId => ({fileId, messageId: message.id})));

        await pubSub.publish(`${SubscriptionType.MESSAGE_ADDED}_${message.chatId}`, message);
        return message;
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Message)
    async recoverMessage(@Arg("id", () => ID) id: string, @Ctx() context: MyContext): Promise<Message> {
        const message = await Message.findOne({where: {id}, withDeleted: true});

        if (!message) {
            throw new HttpQueryError(404, "Message not found");
        }

        if (message.senderId !== context.req.userId) {
            throw new HttpQueryError(403, "Forbidden");
        }

        if (!message.deletedAt) {
            throw new HttpQueryError(409, "Message not deleted");
        }

        await message.recover();
        return await message.save();
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Boolean)
    async removeMessage(@Arg("id", () => ID) id: string, @Ctx() context: MyContext,
                        @PubSub() pubSub: PubSubEngine): Promise<boolean> {
        const message = await Message.findOne({where: {id}, withDeleted: true});

        if (!message) {
            throw new HttpQueryError(404, "Message not found");
        }

        if (message.senderId !== context.req.userId) {
            throw new HttpQueryError(403, "Forbidden");
        }

        if (message.deletedAt) {
            throw new HttpQueryError(409, "Message already deleted");
        }

        await message.softRemove();
        await message.save();
        await pubSub.publish(`${SubscriptionType.MESSAGE_REMOVED}_${message.chatId}`, message);

        return true;
    }

    @Subscription(() => Message, {
        topics: (data) => `${SubscriptionType.MESSAGE_ADDED}_${data.args.chatId}`,

    })
    async messageAdded(@Root() message: Message, @Arg("chatId", () => ID) chatId: string): Promise<Message> {
        return message;
    }

    @Subscription(() => Message, {
        topics: (data) => `${SubscriptionType.MESSAGE_REMOVED}_${data.args.chatId}`,
    })
    async messageRemoved(@Root() message: Message, @Arg("chatId", () => ID) chatId: string): Promise<Message> {
        return message;
    }

    @Subscription(() => Message, {
        topics: (data) => `${SubscriptionType.MESSAGE_UPDATED}_${data.args.chatId}`,
    })
    async messageUpdated(@Root() message: Message, @Arg("chatId", () => ID) chatId: string): Promise<Message> {
        return message;
    }
}
