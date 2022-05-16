import {ChatModel} from "../../../types/models";

export type ChatProps = {
    chat: ChatModel,
    selected?: boolean,
    isParticipant?: boolean,
    onClick?: () => void
}
