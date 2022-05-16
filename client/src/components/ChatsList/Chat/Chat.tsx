import React from 'react';
import styled from "styled-components";
import {ChatProps} from "./types";
import {formatDatetime} from "../../../services/datetimeService";
import {Avatar} from '../../UI';


const Container = styled.div<{ selected?: boolean }>`
  display: grid;
  grid-template-columns: 56px auto;
  align-items: center;
  padding: 10px 30px;
  gap: 10px;
  width: 100%;
  position: relative;
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
  overflow: hidden;

  gap: 5px;
`

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  gap: 5px;
`

const Name = styled.div`
  font-weight: 600;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${props => props.theme.primaryText}
`

const Time = styled.div`
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  color: ${props => props.theme.optionalText}
`

const LastMessage = styled.div<{ exists?: boolean }>`
  padding: 8px 9px;

  background-color: ${props => props.theme.uiSecondaryBg};
  box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 3px;

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-weight: 500;
  font-size: 13px;
  color: ${props => (props.exists ?? true) ? props.theme.primaryText : props.theme.optionalText};
`

const SeenMarker = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  border-radius: 50%;
  width: 7px;
  height: 7px;
  background-color: darkcyan;
`

const Chat = ({chat, selected, isParticipant, onClick}: ChatProps) => (
    <Container selected={selected} onClick={onClick}>
        {chat.lastSeen && chat.lastMessage?.createdAt > chat.lastSeen && isParticipant &&
            <SeenMarker/>
        }
        <Avatar size={"medium"} src={chat.avatar?.url} alt={"chat_icon"}/>
        <Data>
            <Header>
                <Name>{chat.name}</Name>
                <Time>{chat.lastMessage ? formatDatetime(chat.lastMessage.createdAt) : ""}</Time>
            </Header>
            {chat.lastMessage ?
                <LastMessage>{`${chat.lastMessage.sender.name}: ${chat.lastMessage.text}`}</LastMessage> :
                <LastMessage exists={false}>Пока пусто...</LastMessage>
            }
        </Data>
    </Container>
);


export default Chat;
