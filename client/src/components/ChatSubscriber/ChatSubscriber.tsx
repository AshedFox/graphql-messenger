import React, {FC} from 'react';
import useSubscribeChat from "../../hooks/useSubscribeChat";

const ChatSubscriber: FC<{chatId: string}> = ({chatId}) => {
    useSubscribeChat(chatId);

    return <></>
};

export default ChatSubscriber;
