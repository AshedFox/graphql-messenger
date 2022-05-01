import {
    useChatRemovedSubscription,
    useChatUpdatedSubscription,
    useChatUserJoinedSubscription,
    useChatUserLeavedSubscription,
    useChatUserUpdatedSubscription,
    useMessageAddedSubscription,
    useMessageRemovedSubscription
} from "../data/generated/graphql";
import {useChatsStore} from "../stores/chatsStore";


const useSubscribeChat = (chatId: string) => {
    const {
        updateChat, removeChat, addChatUser, removeChatUser, updateChatUser, addMessage, removeMessage,
        unselectIfSelected, removeSearchChat
    } = useChatsStore();

    useChatUpdatedSubscription({
        shouldResubscribe: true,
        variables: {
            chatId
        },
        onSubscriptionData: ({subscriptionData}) => {
            if (subscriptionData.data) {
                updateChat(subscriptionData.data.chatUpdated);
            }
        }
    });
    useChatRemovedSubscription({
        shouldResubscribe: true,
        variables: {
            chatId
        },
        onSubscriptionData: ({subscriptionData}) => {
            if (subscriptionData.data) {
                const id = subscriptionData.data.chatRemoved.id;

                removeChat(id);
                removeSearchChat(id);
                unselectIfSelected(id);
            }
        }
    });
    useChatUserJoinedSubscription({
        shouldResubscribe: true,
        variables: {
            chatId
        },
        onSubscriptionData: ({subscriptionData}) => {
            if (subscriptionData.data) {
                addChatUser(subscriptionData.data.chatUserJoined);
            }
        }
    });
    useChatUserLeavedSubscription({
        shouldResubscribe: true,
        variables: {
            chatId
        },
        onSubscriptionData: ({subscriptionData}) => {
            if (subscriptionData.data) {
                const chatId = subscriptionData.data.chatUserLeaved.chat.id;
                const userId = subscriptionData.data.chatUserLeaved.user.id;

                removeChatUser(chatId, userId);
            }
        }
    });
    useChatUserUpdatedSubscription({
        shouldResubscribe: true,
        variables: {
            chatId
        },
        onSubscriptionData: ({subscriptionData}) => {
            if (subscriptionData.data) {
                updateChatUser(subscriptionData.data.chatUserUpdated);
            }
        }
    });
    useMessageAddedSubscription({
        shouldResubscribe: true,
        variables: {
            chatId
        },
        onSubscriptionData: ({subscriptionData}) => {
            if (subscriptionData.data) {
                addMessage(subscriptionData.data.messageAdded);
            }
        }
    });
    useMessageRemovedSubscription({
        shouldResubscribe: true,
        variables: {
            chatId
        },
        onSubscriptionData: ({subscriptionData}) => {
            if (subscriptionData.data) {
                const id = subscriptionData.data.messageRemoved.id;
                const chatId = subscriptionData.data.messageRemoved.chat.id;

                removeMessage(chatId, id);
            }
        }
    });
};

export default useSubscribeChat;
