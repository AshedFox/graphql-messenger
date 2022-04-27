import React, {useCallback, useEffect, useState} from 'react';
import styled from "styled-components";
import Input from "../../shared/Input";
import {GiHamburgerMenu} from "react-icons/gi";
import IconButton from '../../shared/IconButton';
import {observer} from "mobx-react-lite";
import {CgClose} from "react-icons/cg";
import {AiOutlineSearch} from "react-icons/ai";
import {useChatsLazyQuery, useSearchChatsLazyQuery} from "../../../data/generated/graphql";
import Loader from "../../shared/Loader";
import ChatsList from "../../ChatsList/ChatsList";
import {useFunctionsSideBarStore} from "../../../stores/functionsSideBarStore";
import {useChatsStore} from "../../../stores/chatsStore";
import Button from "../../shared/Button";

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
  gap: 12px;
  padding: 0 30px;

  background: ${props => props.theme.secondaryBg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
`

const Footer = styled.div`
  z-index: 99;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 30px;

  background: ${props => props.theme.secondaryBg};
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.25);
`

const InfoMessage = styled.div`
  font-size: 18px;
  color: ${props => props.theme.primaryText};
  margin: auto;
  padding: 30px;
`

const RefreshButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const LeftColumn = observer(() => {
    const {open} = useFunctionsSideBarStore();
    const {
        sortedChats, setChats, selectedChatId, setSelectedChatId, searchChats, setSearchChats,
        setIsSearch, isSearch
    } = useChatsStore();
    const [getChatsQuery] = useChatsLazyQuery();
    const [searchChatsQuery] = useSearchChatsLazyQuery();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();
    const [searchText, setSearchText] = useState("");

    const loadChats = useCallback(async () => {
        try {
            setLoading(true);
            setError(undefined);

            const getChatsResult = await getChatsQuery({
                variables: {
                    count: -1
                }
            });

            if (getChatsResult.data) {
                setChats(getChatsResult.data.chats.chats);
            }
        } catch (e) {
            setError("");
        } finally {
            setLoading(false);
        }
    }, [getChatsQuery, setChats])

    const search = async () => {
        if (searchText !== "") {
            try {
                setIsSearch(true);
                setLoading(true);
                setError(undefined);

                const searchResult = await searchChatsQuery({
                    variables: {
                        name: searchText
                    }
                });

                if (searchResult.data) {
                    setSearchChats(searchResult.data.searchChats.chats);
                }
            } catch (e) {
                setError("");
            } finally {
                setLoading(false);
            }
        } else {
            resetSearch();
        }
    }

    const resetSearch = () => {
        setIsSearch(false);
        //setSearchChats(undefined);
        setSearchText("");
        //setSelectedChatId(undefined);
    }

    useEffect(() => {
        loadChats();
    }, [loadChats])

    const renderChats = () => {
        if (loading) {
            return <Loader stretch/>
        }
        if (error) {
            return (
                <RefreshButtonWrapper>
                    <Button _size={"medium"} onClick={loadChats}>Попробовать снова</Button>
                </RefreshButtonWrapper>
            )
        }

        if (isSearch) {
            if (searchChats.length === 0) {
                return <InfoMessage>Не найдено ни одного чата удовлетворяющего условиям</InfoMessage>
            }

            return <ChatsList chats={searchChats} selectedChatId={selectedChatId}
                              setSelectedChatId={setSelectedChatId}/>

        } else {
            if (sortedChats.length === 0) {
                return <InfoMessage>Ваш список чатов пуст</InfoMessage>
            }

            return <ChatsList chats={sortedChats} selectedChatId={selectedChatId}
                              setSelectedChatId={setSelectedChatId}/>
        }

    }

    return (
        <Wrapper>
            <Header>
                <IconButton onClick={open}>
                    <GiHamburgerMenu size={28}/>
                </IconButton>
                <Input placeholder={"Поиск"} _stretch value={searchText} onChange={(e) => setSearchText(e.target.value)}
                       onKeyPress={async (e) => {
                           if (e.key === "Enter") {
                               await search();
                           }
                       }}
                />
                {searchChats !== undefined &&
                    <IconButton onClick={resetSearch}>
                        <CgClose size={20}/>
                    </IconButton>
                }
                <IconButton onClick={search}>
                    <AiOutlineSearch size={24}/>
                </IconButton>
            </Header>
            {renderChats()}
            <Footer/>
        </Wrapper>
    )
});

export default LeftColumn;
