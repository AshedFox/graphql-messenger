import React, {ChangeEvent, useState} from 'react';
import styled from "styled-components";
import {observer} from "mobx-react-lite";
import {AddChatInput, useAddChatMutation, useSingleUploadMutation} from "../../data/generated/graphql";
import {useCreateChatModalStore} from "../../stores/createChatModalStore";
import {AvatarInput, Button, Input, Modal} from "../UI";


const Content = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: 10px;
  padding: 10px;
`

const Error = styled.div`
  font-size: 14px;
  color: ${props => props.theme.primaryText};
`

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`

const initialAddChatInput: AddChatInput = {
    name: ""
}

const CreateChatModal = observer(() => {
    const {status, startClosing, endClosing} = useCreateChatModalStore();
    const [addChatInput, setAddChatInput] = useState<AddChatInput>(initialAddChatInput);
    const [addChatMutation] = useAddChatMutation();
    const [uploadChatAvatar, {data: fileData, loading: fileLoading, reset: resetFile}] = useSingleUploadMutation();
    const [error, setError] = useState("");

    const handleChatCreation = async () => {
        const addChatResult = await addChatMutation({
            variables: {
                input: {
                    ...addChatInput,
                    avatarId: fileData?.singleUpload.id
                }
            }
        });

        if (addChatResult.errors || !addChatResult.data) {
            setError("Не удалось создать чат!");
        } else {
            startClosing();
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAddChatInput(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleFileChange = async (file: File) => {
        if (file) {
            try {
                const uploadResult = await uploadChatAvatar({
                    variables: {
                        input: file
                    },
                })

                if (!uploadResult.data) {
                    setError("Не удалось загрузить файл!");
                }
            } catch (e) {
                setError("Не удалось загрузить файл!");
            }
        }
    }

    return (
        <Modal status={status} startClosing={startClosing} endClosing={endClosing} title={"Создание чата"}
               footer={(
                   <Footer>
                       {error && <Error>{error}</Error>}
                       <Button onClick={handleChatCreation} _type={"secondary"} _stretch disabled={fileLoading}>Создать
                           чат</Button>
                   </Footer>
               )}
        >
            <Content>
                <AvatarInput fileSrc={fileData?.singleUpload.url} onFileChange={handleFileChange}
                             acceptType={"image/*"}/>
                <Input name={"name"} value={addChatInput.name} placeholder={"Название"} onChange={handleChange}
                       _stretch _type={"primary"}/>
            </Content>
        </Modal>
    );
});

export default CreateChatModal;
