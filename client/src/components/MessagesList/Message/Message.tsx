import React from 'react';
import styled from "styled-components";
import {formatDatetime} from "../../../services/datetimeService";
import {Avatar} from '../../UI';
import {MessageProps} from "./types";


const Container = styled.div`
  display: grid;
  grid-template-columns: 32px auto;
  align-items: flex-end;
  align-self: flex-start;
  //overflow-x: hidden;
  gap: 10px;
`

const Body = styled.div<{ self: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  gap: 5px;
  border-radius: 3px;
  overflow: hidden;
  background-color: ${props => props.self ? props.theme.uiPrimaryHoverBg : props.theme.uiPrimaryBg};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`

const Name = styled.span`
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${props => props.theme.primaryText};
`

const Time = styled.span`
  font-weight: 500;
  font-size: 13px;
  white-space: nowrap;
  color: ${props => props.theme.optionalText};
`

const Text = styled.div`
  font-size: 13px;
  font-weight: 500;
  white-space: break-spaces;
  word-wrap: break-word;
  color: ${props => props.theme.primaryText};
`

const Message = ({message, isSelf}: MessageProps) => (
    <Container>
        <Avatar size={"small"} src={message.sender.avatar?.url} alt={"avatar"}/>
        <Body self={isSelf ?? false}>
            <Header>
                <Name>{message.sender.name}</Name>
                <Time>{formatDatetime(message.createdAt)}</Time>
            </Header>
            <Text>{message.text}</Text>
        </Body>
    </Container>
);

export default Message;
