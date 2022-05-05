import {
    Arg,
    Ctx,
    FieldResolver,
    ID,
    Mutation,
    PubSub,
    PubSubEngine,
    Query,
    Resolver,
    Root,
    Subscription,
    UseMiddleware
} from "type-graphql";
import {ChatInvite} from "../enitities/ChatInvite";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {MyContext} from "../../types/MyContext";
import {HttpQueryError} from "apollo-server-core";
import {ChatUser} from "../enitities/ChatUser";
import {Chat} from "../enitities/Chat";
import {v4} from "uuid";
import {SubscriptionType} from "./SubscriptionType";
import {GenerateChatInviteInput} from "../inputs/GenerateChatInviteInput";
import {mapChatInviteUsageTermToMs} from "../../services/enumMapper";
import {ChatUserStatus} from "../enitities/ChatUserStatus";

@Resolver(ChatInvite)
export class ChatInviteResolver {
    @FieldResolver(() => Chat)
    async chat(@Root() chatInvite: ChatInvite): Promise<Chat | null> {
        return await Chat.findOne({where: {id: chatInvite.chatId}, withDeleted: true});
    }

    @UseMiddleware(authMiddleware)
    @Query(() => Boolean)
    async checkInvite(@Arg("token") token: string): Promise<boolean> {
        const invite = await ChatInvite.findOneBy({token});

        if (!invite) {
            throw new HttpQueryError(404, "Token not found");
        }

        if (invite.expiredAt && invite.expiredAt < new Date()) {
            throw new HttpQueryError(410, "Token is expired");
        }

        if (invite.leftUses !== undefined && invite.leftUses <= 0) {
            throw new HttpQueryError(410, "Token uses exhausted");
        }

        return true;
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Boolean)
    async activateInvite(@Arg("token") token: string, @Ctx() context: MyContext,
                         @PubSub() pubSub: PubSubEngine): Promise<boolean> {
        const invite = await ChatInvite.findOneBy({token});

        if (!invite) {
            throw new HttpQueryError(404, "Token not found");
        }

        if (invite.expiredAt && invite.expiredAt < new Date()) {
            throw new HttpQueryError(410, "Token is expired");
        }

        if (invite.leftUses !== undefined && invite.leftUses <= 0) {
            throw new HttpQueryError(410, "Token uses exhausted");
        }

        const chatUser = await ChatUser.findOne({where: {chatId: invite.chatId, userId: context.req.userId}, withDeleted: true});

        if (chatUser) {
            if (!(chatUser.status & ChatUserStatus.LEAVED)) {
                throw new HttpQueryError(409, "Chat user already exists");
            } else {
                await chatUser.recover();
                await chatUser.save();
                await pubSub.publish(`${SubscriptionType.CHAT_USER_JOINED}_${invite.chatId}`, chatUser);
            }
        } else {
            const newChatUser = await ChatUser.create({chatId: invite.chatId, userId: context.req.userId}).save();
            await pubSub.publish(`${SubscriptionType.CHAT_USER_JOINED}_${invite.chatId}`, newChatUser);
        }

        if (invite.leftUses !== undefined) {
            invite.leftUses = invite.leftUses - 1;
            await invite.save();
            await pubSub.publish(`${SubscriptionType.CHAT_INVITE_UPDATED}_${invite.chatId}`, invite);
        }
        return true;
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Boolean)
    async generateInvite(@Arg("input") {chatId, usageTerm, maxUses}: GenerateChatInviteInput, @Ctx() context: MyContext,
                         @PubSub() pubSub: PubSubEngine): Promise<boolean> {
        const chat = await Chat.findOneBy({id: chatId});

        if (!chat) {
            throw new HttpQueryError(404, "Chat not found");
        }

        if (chat.creatorId !== context.req.userId) {
            throw new HttpQueryError(403, "Forbidden");
        }

        const termMs = mapChatInviteUsageTermToMs(usageTerm);
        const expiredAt = termMs ? new Date(Date.now() + termMs) : undefined;
        const invite = await ChatInvite.create({chatId, expiredAt, token: v4(), leftUses: maxUses}).save();
        await pubSub.publish(`${SubscriptionType.CHAT_INVITE_ADDED}_${chatId}`, invite);
        return true;
    }

    @UseMiddleware(authMiddleware)
    @Mutation(() => Boolean)
    async removeInvite(@Arg("id", () => ID) id: string, @Ctx() context: MyContext,
                         @PubSub() pubSub: PubSubEngine): Promise<boolean> {
        const chatInvite = await ChatInvite.findOneBy({id});

        if (!chatInvite) {
            throw new HttpQueryError(404, "Invite not found");
        }

        const chat = await Chat.findOneBy({id: chatInvite.chatId});

        if (!chat) {
            throw new HttpQueryError(404, "Chat not found");
        }

        if (chat.creatorId !== context.req.userId) {
            throw new HttpQueryError(403, "Forbidden");
        }

        await chatInvite.softRemove();
        await chatInvite.save();
        await pubSub.publish(`${SubscriptionType.CHAT_INVITE_REMOVED}_${chatInvite.chatId}`, chatInvite);
        return true;
    }

    @Subscription(() => ChatInvite, {
        topics: (data) => `${SubscriptionType.CHAT_INVITE_ADDED}_${data.args.chatId}`
    })
    async chatInviteAdded(@Root() chatInvite: ChatInvite, @Arg("chatId", () => ID) chatId: string): Promise<ChatInvite> {
        return chatInvite;
    }

    @Subscription(() => ChatInvite, {
        topics: (data) => `${SubscriptionType.CHAT_INVITE_UPDATED}_${data.args.chatId}`
    })
    async chatInviteUpdated(@Root() chatInvite: ChatInvite, @Arg("chatId", () => ID) chatId: string): Promise<ChatInvite> {
        return chatInvite;
    }

    @Subscription(() => ChatInvite, {
        topics: (data) => `${SubscriptionType.CHAT_INVITE_REMOVED}_${data.args.chatId}`
    })
    async chatInviteRemoved(@Root() chatInvite: ChatInvite, @Arg("chatId", () => ID) chatId: string): Promise<ChatInvite> {
        return chatInvite;
    }
}
