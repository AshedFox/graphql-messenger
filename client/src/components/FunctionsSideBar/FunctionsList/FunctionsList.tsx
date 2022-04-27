import React from 'react';
import styled from "styled-components";
import Function from "./Function/Function";
import {AiOutlineDelete, AiOutlineUserAdd} from "react-icons/ai";
import {BiLogOut, BiMoon} from "react-icons/bi";
import {useNavigate} from "react-router-dom";
import {useLogoutMutation} from "../../../data/generated/graphql";
import {useThemeStore} from "../../../stores/themeStore";
import {useUserStore} from "../../../stores/userStore";
import {useCreateChatModalStore} from "../../../stores/createChatModalStore";

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow-y: auto;
  gap: 3px;
  flex-grow: 1;
`

const FunctionsList = () => {
    const {switchTheme} = useThemeStore();
    const {setMe} = useUserStore();
    const {open} = useCreateChatModalStore();
    const [logout] = useLogoutMutation();
    const navigate = useNavigate();

    const handleThemeSwitch = () => switchTheme();

    const handleLogout = async () => {
        const logoutResult = await logout();

        if (logoutResult.data?.logout) {
            setMe(undefined);
            navigate("/");
        }
    }

    const handleAccountDeletion = () => {
        if (window.confirm("Вы действительно хотите удалить аккаунт?")) {
            // delete account
        }
    }

    return (
        <Wrapper>
            <List>
                <Function icon={<AiOutlineUserAdd size={24}/>} text={"Создать чат"} onClick={open}/>
                <Function icon={<BiMoon size={24}/>} text={"Сменить тему"} onClick={handleThemeSwitch}/>
                <Function icon={<BiLogOut size={24}/>} text={"Выйти из аккаунта"} onClick={handleLogout}/>
                <Function icon={<AiOutlineDelete size={24}/>} text={"Удалить аккаунт"} onClick={handleAccountDeletion}/>
            </List>
        </Wrapper>
    );
};

export default FunctionsList;
