import React, {useCallback, useEffect, useState} from 'react';
import styled from "styled-components";
import IconButton from "../../shared/IconButton";
import {IoArrowBack, IoSend} from "react-icons/io5";
import {observer} from "mobx-react-lite";
import Input from "../../shared/Input";
import {
    useAddMessageMutation,
    useChatUsersLazyQuery,
    useJoinChatMutation,
    useMessagesLazyQuery
} from "../../../data/generated/graphql";
import Loader from "../../shared/Loader";
import MessagesList from "../../MessagesList/MessagesList";
import {useChatsStore} from "../../../stores/chatsStore";
import Button from "../../shared/Button";
import {BsThreeDotsVertical} from "react-icons/bs";
import {useChatDropdownStore} from "../../../stores/chatDropdownStore";
import ChatDropdown from "../../ChatDropdown/ChatDropdown";
import {ChatUserModel, MessageModel} from "../../../types/models";
import {useUserStore} from "../../../stores/userStore";

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 60px auto 60px;
  height: 100vh;
`

const Header = styled.div`
  z-index: 99;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 0 30px;

  background: ${props => props.theme.secondaryBg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
`

const Title = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.secondaryText};
`

const Stub = styled.div`
  display: flex;
  z-index: 2;
  filter: blur(10px);
  backdrop-filter: blur(10px);
  width: 100%;
  max-height: 100%;
  overflow-y: hidden;

  & > * {
    overflow-y: hidden;
  }
`

const Menu = styled.div``

const Footer = styled.div`
  z-index: 99;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 0 30px;

  background: ${props => props.theme.secondaryBg};
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.25);
`

const Message = styled.div`
  margin: auto;
  font-size: 18px;
  color: ${props => props.theme.primaryText};
`

const RefreshButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`


const MainColumn = observer(() => {
    const {
        selectedChatId, chatsMessages, chatsUsers, setChatMessages, setChatUsers, setSelectedChatId,
        selectedChat, addChatMessages, isParticipant,
    } = useChatsStore();
    const {me} = useUserStore();
    const {switchIsOpen, setIsOpen} = useChatDropdownStore();
    const [getMessages, {fetchMore: fetchMoreMessages, called}] = useMessagesLazyQuery();
    const [getChatUsers] = useChatUsersLazyQuery();
    const [addMessageMutation] = useAddMessageMutation();
    const [joinChatMutation] = useJoinChatMutation();
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [messageText, setMessageText] = useState("");

    const tryGetMessages = useCallback(async (chatId: string): Promise<MessageModel[] | undefined> => {
        if (chatsMessages.has(chatId)) {
            setHasMore(true);
            return chatsMessages.get(chatId)!;
        } else {
            const getMessagesResult = await getMessages({
                variables: {
                    chatId
                }
            });

            if (getMessagesResult.data) {
                setChatMessages(chatId, getMessagesResult.data.messages.messages);
                setHasMore(getMessagesResult.data.messages.hasMore);
                return getMessagesResult.data.messages.messages;
            } else {
                setErrors(prev => [...prev, getMessagesResult.error?.message ?? ""]);
            }
        }
    }, [chatsMessages, getMessages, setChatMessages]);

    const tryGetChatUsers = useCallback(async (chatId: string): Promise<ChatUserModel[] | undefined> => {
        if (chatsUsers.has(chatId)) {
            return chatsUsers.get(chatId)!;
        } else {
            const getChatUsersResult = await getChatUsers({
                variables: {
                    chatId
                }
            });

            if (getChatUsersResult.data?.chatUsers) {
                setChatUsers(chatId, getChatUsersResult.data.chatUsers.chatUsers)
                return getChatUsersResult.data.chatUsers.chatUsers;
            } else if (getChatUsersResult.error) {
                setErrors(prev => [...prev, getChatUsersResult.error?.message ?? ""]);
            }
        }
    }, [chatsUsers, getChatUsers, setChatUsers]);


    const queryChat = useCallback(async (chatId: string) => {
        try {
            await tryGetMessages(chatId);
            await tryGetChatUsers(chatId);
        } catch (e: any) {
            setErrors(prev => [...prev, e.message ?? ""])
        }
    }, [tryGetChatUsers, tryGetMessages])

    const prepareChat = useCallback(async (chatId: string) => {
        setLoading(true);
        setErrors([]);
        await queryChat(chatId);
        setLoading(false);
    }, [queryChat]);

    const handleLoadMoreMessages = async () => {
        if (hasMore && selectedChat && called && !loadingMore) {
            try {
                setLoadingMore(true);

                const last = selectedChat.messages.at(-1);
                const chatId = selectedChat.id;

                const res = await fetchMoreMessages({
                    variables: {
                        chatId: chatId,
                        lastId: last?.id,
                        lastCreatedAt: last?.createdAt,
                    }
                });

                if (res.data) {
                    setHasMore(res.data.messages.hasMore);
                    addChatMessages(chatId, res.data.messages.messages, "end");
                }
            } catch (e) {
                console.log(e);
            } finally {
                setLoadingMore(false);
            }
        }
    }

    const handleClose = () => {
        setSelectedChatId(undefined);
        setIsOpen(false);
        setMessageText("");
        setHasMore(false);
        setLoadingMore(false);
    }

    const handleMessageCreation = async () => {
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

    const handleChatJoin = async () => {
        if (selectedChatId) {
            try {
                const chatId = selectedChatId;

                const result = await joinChatMutation({
                    variables: {
                        chatId
                    }
                });

                if (result.data) {
                    //setSelectedChatId(undefined);
                }
            } catch (e) {

            }
        }
    }

    useEffect(() => {
        if (selectedChatId) {
            prepareChat(selectedChatId);
        }

        return () => setIsOpen(false);
    }, [prepareChat, selectedChatId, setIsOpen]);

    const renderMessagesBlock = (chatId: string, messages: MessageModel[]) => {
        if (isParticipant(chatId)) {
            if (messages.length === 0) {
                return (
                    <Message>В чате пока нет сообщений!</Message>
                )
            }

            return (
                <MessagesList messages={messages.slice().reverse()} loadMore={handleLoadMoreMessages}
                              lastId={messages.at(0)?.id} loadingMore={loadingMore} userId={me?.id}
                />
            );
        } else {
            if (messages.length === 0) {
                return (
                    <Stub>
                        <Message>В чате пока нет сообщений!</Message>
                    </Stub>
                )
            }


            return (
                <Stub>
                    <MessagesList messages={messages.slice().reverse()} loadMore={handleLoadMoreMessages}
                                  lastId={messages.at(0)?.id} userId={me?.id}
                    />
                </Stub>
            );
        }
    }

    if (!selectedChatId) {
        return <Message>Выберите чат, чтобы увидеть здесь его содержимое!</Message>
    }

    if (loading || (!selectedChat && errors.length === 0)) {
        return <Loader stretch size={40}/>
    }

    if (errors.length > 0 || !selectedChat) {
        return (
            <RefreshButtonWrapper>
                <Button _size={"big"} onClick={() => prepareChat(selectedChatId)}>Попробовать снова</Button>
            </RefreshButtonWrapper>
        )
    }

    return (
        <Wrapper>
            <Header>
                <IconButton onClick={handleClose}>
                    <IoArrowBack size={24}/>
                </IconButton>
                <Title>{selectedChat.name}</Title>
                <Menu>
                    {isParticipant(selectedChat.id) &&
                        <>
                            <IconButton onClick={switchIsOpen}>
                                <BsThreeDotsVertical size={24}/>
                            </IconButton>
                            <ChatDropdown selectedChat={selectedChat}/>
                        </>
                    }
                </Menu>
            </Header>
            {renderMessagesBlock(selectedChat.id, selectedChat.messages)}
            <Footer>
                {isParticipant(selectedChatId) ?
                    <>
                        <Input name={"text"} placeholder={"Введите сообщение"} _stretch autoComplete={"off"}
                               value={messageText}
                               onChange={(e) => setMessageText(e.target.value)}
                               onKeyPress={async (e) => {
                                   if (e.key === "Enter") {
                                       await handleMessageCreation();
                                   }
                               }}
                        />
                        <IconButton onClick={handleMessageCreation}>
                            <IoSend size={24}/>
                        </IconButton>
                    </> :
                    <>
                        <Button _stretch _size={"big"} onClick={handleChatJoin}>Присоединиться</Button>
                    </>
                }
            </Footer>
        </Wrapper>
    );
});

export default MainColumn;
