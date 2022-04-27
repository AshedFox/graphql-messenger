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
import {Message} from "../enitities/Message";
import {AddMessageInput} from "../inputs/AddMessageInput";
import {MyContext} from "../../types/MyContext";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {ForbiddenError} from "apollo-server-core";
import {Chat} from "../enitities/Chat";
import {User} from "../enitities/User";
import {SubscriptionType} from "./SubscriptionType";
import {MessagesArgs} from "../args/MessagesArgs";
import {ChatUser} from "../enitities/ChatUser";

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

        queryBuilder = queryBuilder
            .leftJoinAndSelect("message.attachments", "attachment")
            .take(count)
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
                     @PubSub(SubscriptionType.MESSAGE_ADDED) publish: Publisher<Message>): Promise<Message | null> {
        const message = await Message.create({
            ...addMessageInput,
            senderId: context.req.userId,
            attachments: []
        }).save();
        await publish(message);
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
                        @PubSub(SubscriptionType.MESSAGE_REMOVED) publish: Publisher<Message>): Promise<boolean> {
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

    @Subscription(() => Message, {
        topics: SubscriptionType.MESSAGE_ADDED,
        filter: async ({payload, context}: ResolverFilterData<Message, {}, { userId: string }>) => {
            const chatUsers = await ChatUser.find({where: {chatId: payload.chatId}});
            return chatUsers.find(chatUser => chatUser.userId === context.userId) !== null;
        }

    })
    async messageAdded(@Root() message: Message): Promise<Message> {
        return message;
    }

    @Subscription(() => Message, {
        topics: SubscriptionType.MESSAGE_REMOVED,
        filter: async ({payload, context}: ResolverFilterData<Message, {}, { userId: string }>) => {
            const chatUsers = await ChatUser.find({where: {chatId: payload.chatId}});
            return chatUsers.find(chatUser => chatUser.userId === context.userId) !== null;
        }
    })
    async messageRemoved(@Root() message: Message): Promise<Message> {
        return message;
    }
}
