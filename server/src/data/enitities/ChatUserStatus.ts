import {registerEnumType} from "type-graphql";

export enum ChatUserStatus {
    DEFAULT = 0,
    BLOCKED = 1 << 0,
    MUTED = 1 << 1,
    LEAVED = 1 << 2,
    BLOCKED_AND_MUTED = BLOCKED | MUTED,
    BLOCKED_AND_LEAVED = BLOCKED | LEAVED,
    MUTED_AND_LEAVED = MUTED | LEAVED,
    BLOCKED_AND_MUTED_AND_LEAVED = BLOCKED | MUTED | LEAVED
}

registerEnumType(ChatUserStatus, {
    name: "ChatUserStatus"
})
