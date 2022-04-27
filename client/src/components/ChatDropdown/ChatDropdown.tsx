import React, {FC} from 'react';
import Dropdown from "../shared/Dropdown";
import {observer} from "mobx-react-lite";
import {useChatDropdownStore} from "../../stores/chatDropdownStore";
import styled from "styled-components";
import {useUserStore} from "../../stores/userStore";
import {FullChatModel} from "../../types/models";
import {useLeaveChatMutation, useRemoveChatMutation} from "../../data/generated/graphql";
import {useChatUsersModalStore} from "../../stores/chatUsersModalStore";


const MenuItem = styled.div`
  padding: 15px 20px;
  border-radius: 4px;
  transition: background-color 0.4s;
  cursor: pointer;
  user-select: none;
  color: ${props => props.theme.secondaryText};

  &:hover {
    background-color: ${props => props.theme.uiPrimaryHoverBg};
  }
`

type Props = {
    selectedChat: FullChatModel
}

const ChatDropdown: FC<Props> = observer(({selectedChat}) => {
    const {isOpen} = useChatDropdownStore();
    const {me} = useUserStore();
    const {open} = useChatUsersModalStore();
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
            const result = await leaveChatMutation();

            if (result.data && result.data.leaveChat) {
                //removeChat(selectedChat.id);
                //setSelectedChatId(undefined);
            }
        }
    }

    const handleChatDelete = async () => {
        if (window.confirm("Вы действительно хотите удалить чат?")) {
            const result = await removeChatMutation();

            if (result.data && result.data.removeChat) {
                //removeChat(selectedChat.id);
                //setSelectedChatId(undefined);
            }
        }
    }

    return (
        <Dropdown isOpen={isOpen}>
            <MenuItem onClick={open}>Список участников</MenuItem>
            <MenuItem onClick={handleChatLeave}>Покинуть</MenuItem>
            {me?.id === selectedChat.creator.id && <MenuItem onClick={handleChatDelete}>Удалить</MenuItem>}
        </Dropdown>
    );
});

export default ChatDropdown;
