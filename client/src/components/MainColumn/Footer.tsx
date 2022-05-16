import React, {useRef, useState} from 'react';
import {IoSend} from "react-icons/io5";
import styled from "styled-components";
import {Button, IconButton, TextArea} from '../UI';
import Input from "../UI/Input";
import {
    FileType,
    useAddMessageMutation,
    useJoinChatMutation,
    useSingleUploadMutation
} from "../../data/generated/graphql";
import {FileModel} from "../../types/models";
import {ImAttachment} from 'react-icons/im';
import {DocPreview, ImagePreview, VideoPreview} from "../FilePreview";

const Container = styled.div`
  z-index: 99;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px 30px;
  max-width: 100%;
  overflow: hidden;

  background: ${props => props.theme.secondaryBg};
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.25);
`

const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 15px;
`

const PreviewList = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  padding: 5px;

  ::-webkit-scrollbar {
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
    margin: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => `${props.theme.primaryBg}81`};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => `${props.theme.uiPrimaryHoverBg}81`};
  }
`

type Props = {
    isParticipant: boolean,
    selectedChatId: string
}


const Footer = ({isParticipant, selectedChatId}: Props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [singleUploadMutation, {loading}] = useSingleUploadMutation();
    const [addMessageMutation] = useAddMessageMutation();
    const [joinChatMutation] = useJoinChatMutation();
    const [messageText, setMessageText] = useState("");
    const [messageFiles, setMessageFiles] = useState<FileModel[]>([]);

    const createMessage = async () => {
        if (selectedChatId) {
            if (messageText.trim().length > 0) {
                try {
                    const result = await addMessageMutation({
                        variables: {
                            input: {
                                text: messageText.trim(),
                                attachmentsIds: messageFiles.map(file => file.id),
                                chatId: selectedChatId
                            }
                        },
                        fetchPolicy: "no-cache"
                    });

                    if (result.data) {
                        setMessageText("");
                        setMessageFiles([]);
                    } else {
                        window.alert("Не удалось отправить сообщение")
                    }
                } catch {
                    window.alert("Не удалось отправить сообщение")
                }
            } else {
                window.alert("Сообщение не может быть пустым")
            }
        }
    }

    const joinChat = async () => {
        if (selectedChatId) {
            try {
                const result = await joinChatMutation({
                    variables: {
                        chatId: selectedChatId
                    },
                    fetchPolicy: "no-cache"
                });

                if (!result.data) {
                    alert("Не удалось присоединиться к чату!");
                }
            } catch {
                alert("Не удалось присоединиться к чату!");
            }
        }
    }

    const uploadFiles = async (files: FileList) => {
        try {
            const filesArray = Array.from(files);
            if (messageFiles.length + filesArray.length <= 10) {
                for (let i = 0; i < filesArray.length; i++) {
                    const uploadResult = await singleUploadMutation({
                        variables: {
                            input: filesArray[i]
                        },
                        fetchPolicy: "no-cache"
                    });

                    if (uploadResult.data) {
                        setMessageFiles(prev => [...prev, uploadResult.data!.singleUpload]);
                        fileInputRef.current!.value = "";
                    } else {
                        window.alert("Не удалось загрузить файлы")
                    }
                }
            } else {
                window.alert("Максимальное число вложений в сообщении: 10")
            }
        } catch (e) {
            window.alert("Не удалось загрузить файлы")
        }
    }

    const deleteFile = (id: string) => {
        setMessageFiles(prev => prev.filter(file => file.id !== id));
    }

    return (
        <Container>
            {messageFiles.length > 0 &&
                <PreviewList>
                    {messageFiles.map(file => {
                        return (
                            file.type === FileType.Image ?
                                <ImagePreview key={file.id} file={file} withDelete={true} onDelete={() => deleteFile(file.id)}
                                              fitContent
                                /> :
                                file.type === FileType.Video ?
                                    <VideoPreview key={file.id} file={file} withDelete={true} onDelete={() => deleteFile(file.id)}
                                                  fitContent
                                    /> :
                                    <DocPreview key={file.id} file={file} withDelete={true} onDelete={() => deleteFile(file.id)}/>
                        )
                    })}
                </PreviewList>
            }
            {isParticipant ?
                <Content>
                    <Input ref={fileInputRef} type={"file"} onChange={async (e) => {
                        if (e.target.files) {
                            await uploadFiles(e.target.files);
                        }
                    }} style={{display: "none"}} accept={"*"} multiple/>
                    <IconButton onClick={() => fileInputRef.current?.click()} _type={"secondary"}>
                        <ImAttachment size={24}/>
                    </IconButton>
                    <TextArea placeholder={"Введите сообщение"} _stretch autoComplete={"off"}
                              value={messageText} _type={"secondary"} maxLength={1000}
                              onChange={(e) => setMessageText(e.target.value)}
                              onKeyPress={async (e) => {
                                  if (e.key === "Enter" && e.shiftKey) {
                                      e.preventDefault();
                                      await createMessage();
                                  }
                              }}
                    />
                    <IconButton onClick={createMessage} _type={"secondary"} disabled={loading}>
                        <IoSend size={24}/>
                    </IconButton>
                </Content> :
                <Content>
                    <Button _stretch _type={"secondary"} _size={"big"} onClick={joinChat}>Присоединиться</Button>
                </Content>
            }
        </Container>
    );
};

export default Footer;
