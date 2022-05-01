import {
    useChatAddedSubscription,
    useChatJoinedSubscription,
    useChatLeavedSubscription,
    useLastSeenChangedSubscription,
    useProfileUpdatedSubscription
} from "../data/generated/graphql";
import {useChatsStore} from "../stores/chatsStore";
import {useUserStore} from "../stores/userStore";

const useSubscribeUser = (userId: string) => {
    const {addChat, removeChat, selectIfNoSelected, unselectIfSelected, updateChatLastSeen} = useChatsStore();
    const {setMe} = useUserStore();

    useChatAddedSubscription({
        shouldResubscribe: true,
        variables: {
            userId
        },
        onSubscriptionData: ({subscriptionData}) => {
            if (subscriptionData.data) {
                const chat = subscriptionData.data.chatAdded;

                addChat(chat);
                selectIfNoSelected(chat.id);
            }
        }
    });
    useChatJoinedSubscription({
        shouldResubscribe: true,
        variables: {
            userId
        },
        onSubscriptionData: ({subscriptionData}) => {
            if (subscriptionData.data) {
                const chat = subscriptionData.data.chatJoined;

                unselectIfSelected(chat.id);
                removeChat(chat.id);
                addChat(chat);
                selectIfNoSelected(chat.id);
            }
        }
    });
    useChatLeavedSubscription({
        shouldResubscribe: true,
        variables: {
            userId
        },
        onSubscriptionData: ({subscriptionData}) => {
            if (subscriptionData.data) {
                const id = subscriptionData.data.chatLeaved.id;

                removeChat(id);
                unselectIfSelected(id);
            }
        }
    });
    useLastSeenChangedSubscription({
        shouldResubscribe: true,
        variables: {
            userId
        },
        onSubscriptionData: ({subscriptionData}) => {
            if (subscriptionData.data) {
                updateChatLastSeen(subscriptionData.data.lastSeenChanged.chat.id, subscriptionData.data.lastSeenChanged.lastSeen);
            }
        }
    })
    useProfileUpdatedSubscription({
        shouldResubscribe: true,
        variables: {
            userId
        },
        onSubscriptionData: ({subscriptionData}) => {
            if (subscriptionData.data) {
                setMe(subscriptionData.data.profileUpdated);
            }
        }
    });
};

export default useSubscribeUser;
