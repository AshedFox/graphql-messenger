import {ChatModel} from "../../../types/models";

export type ChatProps = {
    chat: ChatModel,
    selected?: boolean,
    onClick?: () => void
}
