import React, {useState} from 'react';
import ChatUsersModal from "../ChatUsersModal";
import {observer} from "mobx-react-lite";
import {MessageModel} from "../../types/models";
import {useChatsStore} from "../../stores/chatsStore";
import {useUserStore} from "../../stores/userStore";
import {useChatDropdownStore} from "../../stores/chatDropdownStore";
import {useMessagesLazyQuery} from "../../data/generated/graphql";
import styled from "styled-components";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import {Status} from "../../types/Status";
import InvitesModal from "../InvitesModal";

const Container = styled.div`
  display: grid;
  grid-template-rows: 60px auto fit-content(220px);
  height: 100vh;
`

const Content = observer(() => {
    const {
        selectedChatId, setSelectedChatId,
        selectedChat, isParticipant,
        addMessages
    } = useChatsStore();
    const {me} = useUserStore();
    const {open: openDropdown, startClosing: startClosingDropdown, status: dropdownStatus} = useChatDropdownStore();
    const [messagesQuery, {loading: loadingMessages}] = useMessagesLazyQuery();
    const [hasMore, setHasMore] = useState(true);

    const loadMoreMessages = async (lastLoaded?: MessageModel) => {
        if (!loadingMessages && selectedChatId && hasMore) {
            try {
                const chatId = selectedChatId;

                const result = await messagesQuery({
                    variables: {
                        chatId,
                        lastId: lastLoaded?.id,
                        lastCreatedAt: lastLoaded?.createdAt
                    }
                });

                if (result.data) {
                    setHasMore(result.data.messages.hasMore);
                    addMessages(chatId, result.data.messages.messages);
                } else {
                    setHasMore(false);
                    window.alert("Не удалось загрузить больше сообщений")
                }
            } catch {
                setHasMore(false);
                window.alert("Не удалось загрузить больше сообщений")
            }
        }
    }

    if (!selectedChat) {
        return null;
    }

    return (
        <Container>
            <ChatUsersModal chatUsers={selectedChat.users}/>
            <InvitesModal chatId={selectedChat.id} invites={selectedChat.invites}/>
            <Header selectedChat={selectedChat} isParticipant={isParticipant}
                    onBackClick={() => setSelectedChatId(undefined)}
                    onMenuClick={() => {
                        if (dropdownStatus === Status.Closed) {
                            openDropdown();
                        } else {
                            startClosingDropdown()
                        }
                    }}
            />
            <Main userId={me!.id} messages={selectedChat.messages}
                  loadMoreMessages={() => loadMoreMessages(selectedChat.messages.at(-1))}
                  isParticipant={isParticipant}
            />
            <Footer isParticipant={isParticipant} selectedChatId={selectedChat.id}/>
        </Container>
    );
});

export default Content;
