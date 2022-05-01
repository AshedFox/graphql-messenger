import {MessageModel} from "../../../types/models";

export type MessageProps = {
    message: MessageModel,
    isSelf?: boolean
}
