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
    const {addChat, removeChat, removeFullChat, unselectIfSelected,
        updateChatLastSeen} = useChatsStore();
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


                removeFullChat(chat.id);
                unselectIfSelected(chat.id);
                addChat(chat);
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

                unselectIfSelected(id);
                removeChat(id);
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
