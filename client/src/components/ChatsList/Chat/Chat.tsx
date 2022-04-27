import React from 'react';
import styled from "styled-components";
import Avatar from "../../shared/Avatar";
import {ChatModel} from "../../../types/models";


const Wrapper = styled.div<{ selected?: boolean }>`
  display: grid;
  grid-template-columns: 56px auto;
  align-items: center;
  padding: 10px 30px;
  gap: 10px;
  width: 100%;
  cursor: pointer;

  background-color: ${props => props.selected ? `${props.theme.uiPrimaryFocusBg} !important` : props.theme.uiPrimaryBg};
  border-radius: 2px;
  transition: 0.4s;

  &:hover {
    background-color: ${props => props.theme.uiPrimaryHoverBg};
  }
`

const Data = styled.div`
  display: flex;
  flex-direction: column;

  gap: 5px;
`

const Header = styled.div`
  display: flex;
  align-items: flex-end;

  gap: 5px;
`

const Name = styled.div`
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  color: ${props => props.theme.primaryText}
`

const Time = styled.div`
  font-weight: 500;
  font-size: 12px;
  white-space: nowrap;
  color: ${props => props.theme.optionalText}
`

const LastMessage = styled.div`
  padding: 8px 9px;

  background-color: ${props => props.theme.uiSecondaryBg};
  box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 3px;

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-weight: 500;
  font-size: 13px;
  color: ${props => props.theme.primaryText};
`

type Props = {
    chat: ChatModel,
    selected?: boolean,
    onClick?: () => void
};

const Chat = ({chat, selected, onClick}: Props) => {
    return (
        <Wrapper selected={selected} onClick={onClick}>
            <Avatar _size={"medium"} src={chat.avatar?.url} alt={"chat_icon"} _stretch/>
            <Data>
                <Header>
                    <Name>{chat.name}</Name>
                    <Time>{chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleTimeString() : ""}</Time>
                </Header>
                <LastMessage>{chat.lastMessage ? `${chat.lastMessage.sender.name}: ${chat.lastMessage.text}` : " "}</LastMessage>
            </Data>
        </Wrapper>
    );
};

export default Chat;
