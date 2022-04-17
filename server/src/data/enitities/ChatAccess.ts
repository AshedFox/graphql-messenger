import {registerEnumType} from "type-graphql";

export enum ChatAccess {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    INVITE_ONLY = "INVITE_ONLY"
}

registerEnumType(ChatAccess, {
    name: "ChatAccess"
})
