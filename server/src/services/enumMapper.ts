import {ChatInviteUsageTerm} from "../data/enitities/ChatInviteUsageTerm";

export const mapChatInviteUsageTermToMs = (term: ChatInviteUsageTerm): number|null => {
    switch (term) {
        case ChatInviteUsageTerm.THIRTY_MINUTES: return 30 * 60 * 1000;
        case ChatInviteUsageTerm.ONE_HOUR: return 60 * 60 * 1000;
        case ChatInviteUsageTerm.TWELVE_HOURS: return 12 * 60 * 60 * 1000;
        case ChatInviteUsageTerm.ONE_DAY: return 24 * 60 * 60 * 1000;
        case ChatInviteUsageTerm.SEVEN_DAYS: return 7 * 24 * 60 * 60 * 1000;
        case ChatInviteUsageTerm.THIRTY_DAYS: return 30 * 24 * 60 * 60 * 1000;
        case ChatInviteUsageTerm.INFINITE: return null;
    }
}
