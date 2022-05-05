import React from 'react';
import {GiHamburgerMenu} from "react-icons/gi";
import {CgClose} from "react-icons/cg";
import {AiOutlineSearch} from "react-icons/ai";
import styled from "styled-components";
import {observer} from "mobx-react-lite";
import {useFunctionsSideBarStore} from "../../stores/functionsSideBarStore";
import {useChatsStore} from "../../stores/chatsStore";
import {IconButton, Input} from '../UI';

const Container = styled.div`
  z-index: 99;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 0 30px;
  overflow-x: hidden;

  background: ${props => props.theme.secondaryBg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
`

type Props = {
    search: (text: string) => Promise<void>,
}

const Header = observer(({search}: Props) => {
    const {open} = useFunctionsSideBarStore();
    const {
        loading, setLoading,
        setError,
        isSearch,
        searchText, setSearchText,
        resetSearch
    } = useChatsStore();

    const handleSearch = async () => {
        if (!loading) {
            try {
                setLoading(true);
                await search(searchText)
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <Container>
            <IconButton onClick={open} _type={"secondary"}>
                <GiHamburgerMenu size={28}/>
            </IconButton>
            <Input placeholder={"Поиск"} _stretch value={searchText} onChange={(e) => setSearchText(e.target.value)}
                   _type={"secondary"} onKeyPress={async (e) => {
                if (e.key === "Enter") {
                    await handleSearch()
                }
            }
            }/>
            {isSearch &&
                <IconButton onClick={resetSearch} _type={"secondary"}>
                    <CgClose size={20}/>
                </IconButton>
            }
            <IconButton onClick={handleSearch} _type={"secondary"}>
                <AiOutlineSearch size={24}/>
            </IconButton>
        </Container>
    );
});

export default Header;
