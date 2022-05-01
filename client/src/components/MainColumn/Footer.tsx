import React from 'react';
import {IoSend} from "react-icons/io5";
import styled from "styled-components";
import {Button, IconButton, TextArea} from '../UI';

const Container = styled.div`
  z-index: 99;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 15px 30px;

  background: ${props => props.theme.secondaryBg};
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.25);
`

type Props = {
    isParticipant: boolean,
    messageText: string,
    changeMessage: (text: string) => void,
    createMessage: () => void,
    joinChat: () => void,
}

const Footer = ({isParticipant, messageText, changeMessage, createMessage, joinChat}: Props) => {
    return (
        <Container>
            {isParticipant ?
                <>
                    <TextArea placeholder={"Введите сообщение"} _stretch autoComplete={"off"}
                              value={messageText} _type={"secondary"} maxLength={1000}
                        //style={{height: "100%", width: "100%"}}
                              onChange={(e) => changeMessage(e.target.value)}
                              onKeyPress={(e) => {
                                  if (e.key === "Enter" && e.shiftKey) {
                                      e.preventDefault();
                                      createMessage();
                                  }
                              }}
                    />
                    <IconButton onClick={createMessage} _type={"secondary"}>
                        <IoSend size={24}/>
                    </IconButton>
                </> :
                <Button _stretch _type={"secondary"} _size={"big"} onClick={joinChat}>Присоединиться</Button>
            }
        </Container>
    );
};

export default Footer;
