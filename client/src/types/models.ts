import {
    ChatModelFragment,
    ChatUserModelFragment,
    FullChatModelFragment,
    MessageModelFragment,
    UserModelFragment
} from "../data/generated/graphql";


export type MessageModel = MessageModelFragment;
export type ChatModel = ChatModelFragment;
export type ChatUserModel = ChatUserModelFragment;
export type UserModel = UserModelFragment;

export type FullChatModel = FullChatModelFragment;
