import React from 'react';
import styled from "styled-components";
import {useChatsLazyQuery, useSearchChatsLazyQuery} from "../../data/generated/graphql";
import {useChatsStore} from "../../stores/chatsStore";
import Main from "./Main";
import Header from "./Header";

const Container = styled.div`
  display: grid;
  grid-template-rows: 60px auto;
  height: 100vh;
  min-width: 220px;
`

const LeftColumn = () => {
    const {
        setChats, setSearchChats,
        setIsSearch, resetSearch,
    } = useChatsStore();
    const [chatsQuery] = useChatsLazyQuery();
    const [searchChatsQuery] = useSearchChatsLazyQuery();

    const loadChats = async () => {
        const result = await chatsQuery({
            variables: {
                count: -1
            }
        });

        if (result.data) {
            setChats(result.data.chats.chats);
        } else {
            throw new Error();
        }
    }

    const search = async (searchText: string) => {
        if (searchText.trim() !== "") {
            setIsSearch(true);

            const searchResult = await searchChatsQuery({
                variables: {
                    name: searchText
                }
            });

            if (searchResult.data) {
                setSearchChats(searchResult.data.searchChats.chats);
            } else {
                throw new Error();
            }
        } else {
            resetSearch();
        }
    }

    return (
        <Container>
            <Header search={search}/>
            <Main load={loadChats} search={search}/>
        </Container>
    )
};

export default LeftColumn;
