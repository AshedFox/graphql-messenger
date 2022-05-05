import {ChatInviteUsageTerm, ChatUserRole} from "../data/generated/graphql";

export const mapChatInviteUsageTerm = (term: ChatInviteUsageTerm): string => {
    switch (term) {
        case ChatInviteUsageTerm.ThirtyMinutes: return "30 минут";
        case ChatInviteUsageTerm.OneHour: return "1 час";
        case ChatInviteUsageTerm.TwelveHours: return "12 часов";
        case ChatInviteUsageTerm.OneDay: return "1 день";
        case ChatInviteUsageTerm.SevenDays: return "7 дней";
        case ChatInviteUsageTerm.ThirtyDays: return "30 дней";
        case ChatInviteUsageTerm.Infinite: return "Вечность";
    }
}

export const mapRole = (role: ChatUserRole): string => {
    switch (role) {
        case ChatUserRole.Default:
            return "Участник"
        case ChatUserRole.Moderator:
            return "Модератор"
        case ChatUserRole.Admin:
            return "Администратор"
        case ChatUserRole.Owner:
            return "Владелец"
    }
}
