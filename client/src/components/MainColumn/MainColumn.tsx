import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {observer} from "mobx-react-lite";
import {useChatLazyQuery} from "../../data/generated/graphql";
import {useChatsStore} from "../../stores/chatsStore";
import Content from "./Content";
import {useChatDropdownStore} from "../../stores/chatDropdownStore";
import {Button, Loader} from '../UI';

const InfoMessage = styled.div`
  margin: auto;
  font-size: 18px;
  color: ${props => props.theme.primaryText};
`

const RefreshButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const MainColumn = observer(() => {
    const {
        selectedChatId, selectedChat,
        addFullChat,
    } = useChatsStore();
    const {startClosing, endClosing} = useChatDropdownStore();
    const [chatQuery] = useChatLazyQuery();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const loadChat = async () => {
        if (selectedChatId && !selectedChat) {
            const result = await chatQuery({
                variables: {
                    id: selectedChatId
                }
            });

            if (result.data && result.data.chat) {
                addFullChat(result.data.chat);
                return;
            }

            throw new Error();
        }
    }

    const tryReload = async () => {
        try {
            setLoading(true);
            await loadChat();
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (selectedChatId) {
            setLoading(true);

            loadChat().catch(() => setError(true)).finally(() => setLoading(false));
        } else {
            setLoading(false);
            startClosing();
            endClosing();
        }
    }, [selectedChatId]);

    if (!selectedChatId) {
        return <InfoMessage>Выберите чат, чтобы увидеть здесь его содержимое!</InfoMessage>
    }

    if (loading) {
        return <Loader stretch size={30}/>
    }

    if (error) {
        return (
            <RefreshButtonContainer>
                <Button _size={"medium"} _type={"secondary"} onClick={tryReload}>Попробовать снова</Button>
            </RefreshButtonContainer>
        )
    }

    return <Content/>
});

export default MainColumn;
