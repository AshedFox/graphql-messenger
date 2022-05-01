import React from 'react';
import {IoArrowBack} from "react-icons/io5";
import {BsThreeDotsVertical} from "react-icons/bs";
import ChatDropdown from "../ChatDropdown";
import styled from "styled-components";
import {FullChatModel} from "../../types/models";
import {IconButton} from '../UI';

const Container = styled.div`
  z-index: 99;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 0 30px;
  width: 100%;
  //overflow-x: hidden;

  background: ${props => props.theme.secondaryBg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
`

const Title = styled.div`
  font-size: 24px;
  font-weight: 600;
  white-space: nowrap;
  //overflow: hidden;
  text-overflow: ellipsis;
  color: ${props => props.theme.secondaryText};
`

type Props = {
    selectedChat: FullChatModel,
    isParticipant: boolean,
    onBackClick: () => void,
    onMenuClick: () => void
}

const Header = ({isParticipant, selectedChat, onBackClick, onMenuClick}: Props) => {
    return (
        <Container>
            <IconButton onClick={onBackClick} _type={"secondary"}>
                <IoArrowBack size={24}/>
            </IconButton>
            <Title>{selectedChat.name}</Title>
            <div>
                {isParticipant &&
                    <>
                        <IconButton onClick={onMenuClick} _type={"secondary"}>
                            <BsThreeDotsVertical size={24}/>
                        </IconButton>
                        <ChatDropdown selectedChat={selectedChat}/>
                    </>
                }
            </div>
        </Container>
    );
};

export default Header;
