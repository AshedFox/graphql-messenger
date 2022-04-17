import {registerEnumType} from "type-graphql";

export enum ChatUserRole {
    DEFAULT = "DEFAULT",
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR"
}

registerEnumType(ChatUserRole, {
    name: "ChatUserRole"
})
