import React from 'react';
import SideBar from "../shared/SideBar";
import {observer} from "mobx-react-lite";
import Avatar from "../shared/Avatar";
import styled from "styled-components";
import FunctionsList from "./FunctionsList/FunctionsList";
import {useUserStore} from "../../stores/userStore";
import {useFunctionsSideBarStore} from "../../stores/functionsSideBarStore";


const Title = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.secondaryText};
`

const FunctionsSideBar = observer(() => {
    const {me} = useUserStore();
    const {status, startClosing, endClosing} = useFunctionsSideBarStore();

    return (
        <SideBar status={status} onEndClosing={endClosing} onStartClosing={startClosing} header={
            <>
                <Avatar _size={"small"} src={me!.avatar?.url} alt={"my_avatar"}/>
                <Title>{me!.name}</Title>
            </>
        }>
            <FunctionsList/>
        </SideBar>
    );
});

export default FunctionsSideBar;
