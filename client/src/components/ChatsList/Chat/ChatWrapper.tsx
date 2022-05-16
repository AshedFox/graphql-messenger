import Chat from './Chat';
import {ChatProps} from "./types";
import {observer} from "mobx-react-lite";
import {useChatsStore} from "../../../stores/chatsStore";


const ChatWrapper = observer((props: ChatProps) => {
    const {checkParticipant} = useChatsStore();
    return <Chat {...props} isParticipant={checkParticipant(props.chat.id)}/>
});

export default ChatWrapper;
