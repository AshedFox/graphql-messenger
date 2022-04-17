import {registerEnumType} from "type-graphql";

export enum ChatStatus {
    DEFAULT = 0,
    BLOCKED = 1 << 0,
    DELETED = 1 << 1,
    BLOCKED_AND_DELETED = BLOCKED | DELETED
}

registerEnumType(ChatStatus, {
    name: "ChatStatus"
})
