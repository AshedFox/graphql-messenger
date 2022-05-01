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
import {ForbiddenError} from "apollo-server-core";
import {Chat} from "../enitities/Chat";
import {User} from "../enitities/User";
import {SubscriptionType} from "./SubscriptionType";
import {MessagesArgs} from "../args/MessagesArgs";

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
            .leftJoinAndSelect("message.attachments", "attachment")
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

    @Query(() => Message, {nullable: true})
    async message(@Arg("id", () => ID) id: string): Promise<Message | null> {
        return await Message.findOneBy({id});
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Message)
    async addMessage(@Arg("input") addMessageInput: AddMessageInput, @Ctx() context: MyContext,
                     @PubSub() pubSub: PubSubEngine): Promise<Message | null> {
        const message = await Message.create({
            ...addMessageInput,
            senderId: context.req.userId,
            attachments: []
        }).save();

        await pubSub.publish(`${SubscriptionType.MESSAGE_ADDED}_${message.chatId}`, message);
        return message;
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Message, {nullable: true})
    async recoverMessage(@Arg("id", () => ID) id: string, @Ctx() context: MyContext): Promise<Message | null> {
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
                        @PubSub() pubSub: PubSubEngine): Promise<boolean> {
        const message = await Message.findOneBy({id});

        if (message) {
            if (message.senderId !== context.req.userId) {
                throw new ForbiddenError("No access!");
            }

            await message.softRemove();
            await message.save();
            await pubSub.publish(`${SubscriptionType.MESSAGE_REMOVED}_${message.chatId}`, message);

            return true;
        }

        return false;
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
