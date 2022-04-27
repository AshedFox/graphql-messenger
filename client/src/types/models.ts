import {
    ChatModelFragment,
    ChatUserModelFragment,
    MessageModelFragment,
    UserModelFragment
} from "../data/generated/graphql";


export type MessageModel = MessageModelFragment;
export type ChatModel = ChatModelFragment;
export type ChatUserModel = ChatUserModelFragment;
export type UserModel = UserModelFragment;

export type FullChatModel = ChatModel & {
    messages: MessageModel[],
    chatUsers: ChatUserModel[]
}
