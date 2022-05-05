import React, {FC} from 'react';
import {observer} from "mobx-react-lite";
import {useChatDropdownStore} from "../../stores/chatDropdownStore";
import styled from "styled-components";
import {useUserStore} from "../../stores/userStore";
import {FullChatModel} from "../../types/models";
import {useLeaveChatMutation, useRemoveChatMutation} from "../../data/generated/graphql";
import {useChatUsersModalStore} from "../../stores/chatUsersModalStore";
import {Dropdown} from '../UI';
import {useInvitesModalStore} from "../../stores/invitesModalStore";


const MenuItem = styled.div`
  padding: 15px 20px;
  border-radius: 4px;
  transition: background-color 0.4s;
  cursor: pointer;
  user-select: none;
  color: ${props => props.theme.primaryText};

  &:hover {
    background-color: ${props => props.theme.uiPrimaryHoverBg};
  }
`

type Props = {
    selectedChat: FullChatModel
}

const ChatDropdown: FC<Props> = observer(({selectedChat}) => {
    const {status, endClosing} = useChatDropdownStore();
    const {me} = useUserStore();
    const {open: openUsersModal} = useChatUsersModalStore();
    const {open: openInvitesModal} = useInvitesModalStore();
    const [leaveChatMutation] = useLeaveChatMutation({
        variables: {
            chatId: selectedChat.id
        }
    });
    const [removeChatMutation] = useRemoveChatMutation({
        variables: {
            id: selectedChat.id
        }
    })

    const handleChatLeave = async () => {
        if (window.confirm("Вы действительно хотите покинуть чат?")) {
            try {
                const result = await leaveChatMutation();

                if (!result.data) {
                    window.alert("Не удалось покинуть чат!");
                }
            } catch {
                window.alert("Не удалось покинуть чат!")
            }
        }
    }

    const handleChatDelete = async () => {
        if (window.confirm("Вы действительно хотите удалить чат?")) {
            try {
                const result = await removeChatMutation();

                if (!result.data) {
                    window.alert("Не удалось удалить чат!");
                }
            } catch {
                window.alert("Не удалось удалить чат!");
            }
        }
    }

    return (
        <Dropdown status={status} endClosing={endClosing}>
            {me?.id === selectedChat.creator.id && <MenuItem onClick={openInvitesModal}>Приглашения</MenuItem>}
            <MenuItem onClick={openUsersModal}>Список участников</MenuItem>
            <MenuItem onClick={handleChatLeave}>Покинуть</MenuItem>
            {me?.id === selectedChat.creator.id && <MenuItem onClick={handleChatDelete}>Удалить</MenuItem>}
        </Dropdown>
    );
});

export default ChatDropdown;
