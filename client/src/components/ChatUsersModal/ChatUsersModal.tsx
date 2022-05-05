import React from 'react';
import Modal from "../UI/Modal";
import {observer} from "mobx-react-lite";
import {useChatUsersModalStore} from "../../stores/chatUsersModalStore";
import styled from "styled-components";
import Avatar from "../UI/Avatar";
import {ChatUserModel} from "../../types/models";
import {mapRole} from "../../services/enumMapper";

const List = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 15px;
  overflow-y: auto;
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

type Props = {
    chatUsers: ChatUserModel[]
}

const ChatUsersModal = observer(({chatUsers}: Props) => {
    const {status, startClosing, endClosing} = useChatUsersModalStore();

    return (
        <Modal status={status} startClosing={startClosing} endClosing={endClosing} title={"Список участников чата"}>
            <List>
                {chatUsers.map((chatUser) => {
                    return (
                        <Element key={chatUser.user.id}>
                            <Avatar size={"small"} src={chatUser.user.avatar?.url}/>
                            <Name>{chatUser.user.name}</Name>
                            <Role>{mapRole(chatUser.role)}</Role>
                        </Element>
                    )
                })}
            </List>
        </Modal>
    );
});

export default ChatUsersModal;
