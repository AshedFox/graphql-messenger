import React, {FC} from 'react';
import styled from "styled-components";
import Chat from './Chat/Chat';
import {ChatModel} from "../../types/models";

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3px;
  gap: 3px;
  overflow-y: auto;

  width: 100%;
  height: 100%;
`

type Props = {
    chats: ChatModel[];
    selectedChatId?: string;
    setSelectedChatId?: (chatId?: string) => void;
}

const ChatsList: FC<Props> = ({chats, selectedChatId, setSelectedChatId}) => {
    return (
        <List>
            {chats.map((chat) =>
                <Chat key={chat.id} chat={chat} selected={selectedChatId === chat.id} onClick={() => {
                    if (selectedChatId === chat.id) {
                        setSelectedChatId?.(undefined);
                    } else {
                        setSelectedChatId?.(chat.id)
                    }
                }}/>
            )}
        </List>
    );
};

export default ChatsList;
