import Chat from './Chat';
import useSubscribeChat from "../../../hooks/useSubscribeChat";
import {ChatProps} from "./types";


const ChatWrapper = (props: ChatProps) => {
    useSubscribeChat(props.chat.id);

    return <Chat {...props}/>
};

export default ChatWrapper;
