import {registerEnumType} from "type-graphql";

export enum ChatInviteUsageTerm {
    THIRTY_MINUTES = "THIRTY_MINUTES",
    ONE_HOUR = "ONE_HOUR",
    TWELVE_HOURS = "TWELVE_HOURS",
    ONE_DAY = "ONE_DAY",
    SEVEN_DAYS = "SEVEN_DAYS",
    THIRTY_DAYS = "THIRTY_DAYS",
    INFINITE = "INFINITE"
}

registerEnumType(ChatInviteUsageTerm, {
    name: "ChatInviteUsageTerm"
})
