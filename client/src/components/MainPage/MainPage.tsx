import React from 'react';
import LeftColumn from "./LeftColumn/LeftColumn";
import MainColumn from "./MainColumn/MainColumn";
import styled from "styled-components";
import FunctionsSideBar from "../FunctionsSideBar/FunctionsSideBar";
import CreateChatModal from "../CreateChatModal/CreateChatModal";
import ChatUsersModal from "../ChatUsersModal/ChatUsersModal";
import {
    useChatAddedSubscription,
    useChatJoinedSelfSubscription,
    useChatJoinedSubscription,
    useChatLeavedSelfSubscription,
    useChatLeavedSubscription,
    useChatRemovedSubscription,
    useMessageAddedSubscription
} from "../../data/generated/graphql";
import {useChatsStore} from "../../stores/chatsStore";
import {observer} from "mobx-react-lite";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 360px auto;
  grid-template-rows: 100vh;
  width: 100vw;
  height: 100vh;
  background-color: ${props => props.theme.primaryBg};
  transition: background-color 0.4s;
`

const MainPage = observer(() => {
    const {
        addChat,
        addChatUser,
        removeChat,
        addChatMessage,
        removeChatUser,
        setSelectedChatId,
        selectedChatId
    } = useChatsStore();

    useChatAddedSubscription({
        shouldResubscribe: true,
        onSubscriptionData: ({subscriptionData}) => {
            if (subscriptionData.data) {
                addChat(subscriptionData.data.chatAdded);

                if (!selectedChatId) {
                    setSelectedChatId(subscriptionData.data.chatAdded.id);
                }
            }
        }
    });
    useChatRemovedSubscription({
        shouldResubscribe: true,
        onSubscriptionData: ({subscriptionData}) => {
            if (subscriptionData.data) {
                removeChat(subscriptionData.data.chatRemoved.id);

                if (selectedChatId === subscriptionData.data.chatRemoved.id) {
                    setSelectedChatId(undefined);
                }
            }
        }
    })
    useChatJoinedSubscription({
        shouldResubscribe: true,
        onSubscriptionData: ({subscriptionData}) => {
            if (subscriptionData.data) {
                addChatUser(subscriptionData.data.chatJoined);
            }
        }
    });
    useChatJoinedSelfSubscription({
        shouldResubscribe: true,
        onSubscriptionData: ({subscriptionData}) => {
            if (subscriptionData.data) {
                addChat(subscriptionData.data.chatJoinedSelf);

                if (!selectedChatId) {
                    setSelectedChatId(subscriptionData.data.chatJoinedSelf.id);
                } else if (selectedChatId === subscriptionData.data.chatJoinedSelf.id) {
                    setSelectedChatId(undefined);
                    setSelectedChatId(subscriptionData.data.chatJoinedSelf.id)
                }
            }
        }
    });
    useChatLeavedSubscription({
        shouldResubscribe: true,
        onSubscriptionData: ({subscriptionData}) => {
            if (subscriptionData.data) {
                removeChatUser(subscriptionData.data.chatLeaved.chat.id, subscriptionData.data.chatLeaved.user.id);
            }
        }
    });
    useChatLeavedSelfSubscription({
        shouldResubscribe: true,
        onSubscriptionData: ({subscriptionData}) => {
            if (subscriptionData.data) {
                removeChat(subscriptionData.data.chatLeavedSelf.id);

                if (selectedChatId === subscriptionData.data.chatLeavedSelf.id) {
                    setSelectedChatId(undefined);
                }
            }
        }
    });
    useMessageAddedSubscription({
        shouldResubscribe: true,
        onSubscriptionData: ({subscriptionData}) => {
            if (subscriptionData.data) {
                addChatMessage(subscriptionData.data.messageAdded)
            }
        }
    });

    return (
        <>
            <FunctionsSideBar/>
            <CreateChatModal/>
            <ChatUsersModal/>
            <Wrapper>
                <LeftColumn/>
                <MainColumn/>
            </Wrapper>
        </>
    );
});

export default MainPage;
