import React, {useEffect} from 'react';
import ChatsList from "../ChatsList";
import {observer} from "mobx-react-lite";
import {useChatsStore} from "../../stores/chatsStore";
import styled from "styled-components";
import {Button, Loader} from '../UI';


const RefreshButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

type Props = {
    load: () => Promise<void>,
    search: (text: string) => Promise<void>
}

const Main = observer(({load, search}: Props) => {
    const {
        isSearch, searchText,
        selectedChatId, setSelectedChatId,
        sortedChats, searchChats,
        loading, error,
        setLoading, setError
    } = useChatsStore();


    const tryReload = async () => {
        try {
            setLoading(true);
            if (isSearch) {
                await search(searchText)
            } else {
                await load();
            }
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setLoading(true);

        load().catch(() => setError(true)).finally(() => setLoading(false));
    }, []);

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

    return (
        <ChatsList chats={isSearch ? searchChats : sortedChats}
                   selectChat={(id?: string) => {
                       setSelectedChatId(id)
                   }}
                   selectedChatId={selectedChatId}
                   emptyMessage={isSearch ? "Не удалось ничего найти!" : "Список чатов пуст!"}
        />
    );
});

export default Main;
