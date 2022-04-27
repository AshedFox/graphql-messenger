import React from 'react';
import Modal from "../shared/Modal";
import {observer} from "mobx-react-lite";
import {useChatUsersModalStore} from "../../stores/chatUsersModalStore";
import styled from "styled-components";
import {useChatsStore} from "../../stores/chatsStore";
import Avatar from "../shared/Avatar";
import {ChatUserRole} from "../../data/generated/graphql";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 15px;
  overflow-x: auto;
  padding: 10px;
`

const Element = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`

const Name = styled.div`
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  color: ${props => props.theme.primaryText};
`

const Role = styled.div`
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  color: ${props => props.theme.primaryText};
  margin-left: auto;
`

const mapRole = (role: ChatUserRole) => {
    switch (role) {
        case ChatUserRole.Default:
            return "Участник"
        case ChatUserRole.Moderator:
            return "Модератор"
        case ChatUserRole.Admin:
            return "Администратор"
        case ChatUserRole.Owner:
            return "Владелец"
    }
}

const ChatUsersModal = observer(() => {
    const {status, startClosing, endClosing} = useChatUsersModalStore();
    const {selectedChatId, chatsUsers} = useChatsStore();

    if (!selectedChatId) {
        return null;
    }

    return (
        <Modal status={status} onStartClosing={startClosing} onEndClosing={endClosing} title={"Список участников чата"}>
            <Content>
                {chatsUsers.get(selectedChatId)?.map((chatUser) => {
                    return (
                        <Element key={chatUser.user.id}>
                            <Avatar _size={"small"} src={chatUser.user.avatar?.url}/>
                            <Name>{chatUser.user.name}</Name>
                            <Role>{mapRole(chatUser.role)}</Role>
                        </Element>
                    )
                })}
            </Content>
        </Modal>
    );
});

export default ChatUsersModal;
