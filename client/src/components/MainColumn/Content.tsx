import React, {useState} from 'react';
import ChatUsersModal from "../ChatUsersModal";
import {observer} from "mobx-react-lite";
import {MessageModel} from "../../types/models";
import {useChatsStore} from "../../stores/chatsStore";
import {useUserStore} from "../../stores/userStore";
import {useChatDropdownStore} from "../../stores/chatDropdownStore";
import {useAddMessageMutation, useJoinChatMutation, useMessagesLazyQuery} from "../../data/generated/graphql";
import styled from "styled-components";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import {Status} from "../../types/Status";

const Container = styled.div`
  display: grid;
  grid-template-rows: 60px auto fit-content(120px);
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
    const [addMessageMutation] = useAddMessageMutation();
    const [joinChatMutation] = useJoinChatMutation();
    const [messageText, setMessageText] = useState("");
    const [hasMore, setHasMore] = useState(true);

    const loadMoreMessages = async (lastLoaded?: MessageModel) => {
        if (!loadingMessages && selectedChatId && hasMore) {
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
            }
        }
    }

    const createMessage = async () => {
        if (selectedChatId && messageText.length > 0) {
            const result = await addMessageMutation({
                variables: {
                    input: {
                        text: messageText,
                        chatId: selectedChatId
                    }
                }
            });

            if (result.data) {
                setMessageText("");
            }
        }
    }

    const joinChat = async () => {
        if (selectedChatId) {
            const result = await joinChatMutation({
                variables: {
                    chatId: selectedChatId
                }
            });

            if (!result.data) {
                alert("Не удалось присоединиться к чату!");
            }
        }
    }

    if (!selectedChat) {
        return null;
    }

    return (
        <Container>
            <ChatUsersModal chatUsers={selectedChat.users}/>
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
            <Footer isParticipant={isParticipant} messageText={messageText}
                    changeMessage={(text) => setMessageText(text)}
                    createMessage={createMessage} joinChat={joinChat}
            />
        </Container>
    );
});

export default Content;
