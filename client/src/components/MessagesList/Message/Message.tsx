import React from 'react';
import styled from "styled-components";
import Avatar from "../../shared/Avatar";
import {MessageModel} from "../../../types/models";


const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 32px auto;
  align-items: flex-end;
  align-self: flex-start;
  gap: 10px;
`

const Body = styled.div<{ self: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  gap: 5px;
  border-radius: 3px;
  background-color: ${props => props.self ? props.theme.uiPrimaryHoverBg : props.theme.uiPrimaryBg};
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
  color: ${props => props.theme.primaryText};
`

const Time = styled.div`
  font-weight: 500;
  font-size: 12px;
  white-space: nowrap;
  color: ${props => props.theme.optionalText};
`

const Text = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme.primaryText};
`

type Props = {
    message: MessageModel,
    isSelf?: boolean
}

const Message = ({message, isSelf}: Props) => {
    return (
        <Wrapper>
            <Avatar _size={"small"} src={message.sender.avatar?.url} alt={"avatar"}/>
            <Body self={isSelf ?? false}>
                <Header>
                    <Name>{message.sender.name}</Name>
                    <Time>{new Date(message.createdAt).toLocaleTimeString()}</Time>
                </Header>
                <Text>{message.text}</Text>
            </Body>
        </Wrapper>
    );
};

export default Message;
