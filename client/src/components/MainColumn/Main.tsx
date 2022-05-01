import React from 'react';
import MessagesList from "../MessagesList";
import {MessageModel} from "../../types/models";
import styled from "styled-components";

const Stub = styled.div`
  display: flex;
  z-index: 2;
  filter: blur(10px);
  backdrop-filter: blur(10px);
  width: 100%;
  height: 100%;
  overflow-y: hidden;

  & > * {
    overflow-y: hidden;
  }
`


type Props = {
    messages: MessageModel[],
    isParticipant: boolean,
    loadMoreMessages?: () => void,
    userId: string
}

const Main = ({messages, userId, isParticipant, loadMoreMessages}: Props) => {
    return isParticipant ?
        <MessagesList messages={messages} userId={userId}
                      emptyMessage={"Здесь пока нет сообщений"}
                      order={"reverse"} loadMore={loadMoreMessages}
        /> :
        <Stub>
            <MessagesList messages={messages}
                          emptyMessage={"Здесь пока нет сообщений"}
                          order={"reverse"}
            />
        </Stub>
};

export default Main;
