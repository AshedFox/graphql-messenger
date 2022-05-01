import React, {FC} from 'react';
import styled from "styled-components";
import {ChatModel} from "../../types/models";
import Chat from './Chat';

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3px;
  gap: 3px;
  overflow-y: auto;

  width: 100%;
  max-height: 100%;

  /* width */

  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */

  ::-webkit-scrollbar-track {
    background: transparent;
    margin: 4px;
  }

  /* Handle */

  ::-webkit-scrollbar-thumb {
    background: ${props => `${props.theme.secondaryBg}81`};
    border-radius: 4px;
  }

  /* Handle on hover */

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => `${props.theme.uiSecondaryHoverBg}81`};
  }
`

const EmptyMessage = styled.div`
  font-size: 18px;
  color: ${props => props.theme.primaryText};
  margin: auto;
  padding: 30px;
`

type Props = {
    chats: ChatModel[];
    selectedChatId?: string;
    selectChat: (id?: string) => void;
    emptyMessage?: string;
}

const ChatsList: FC<Props> = ({chats, selectedChatId, selectChat, emptyMessage}) => {
    if (chats.length === 0) {
        return <EmptyMessage>{emptyMessage}</EmptyMessage>
    }

    return (
        <List>
            {chats.map((chat) => (
                <Chat key={chat.id} chat={chat} selected={selectedChatId === chat.id} onClick={() => {
                    selectChat(chat.id === selectedChatId ? undefined : chat.id);
                }}/>
            ))}
        </List>
    );
};

export default ChatsList;
