import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import styled from "styled-components";
import FunctionsList from "./FunctionsList";
import {useUserStore} from "../../stores/userStore";
import {useFunctionsSideBarStore} from "../../stores/functionsSideBarStore";
import {useSingleUploadMutation, useUpdateProfileMutation} from "../../data/generated/graphql";
import {BiPencil} from "react-icons/bi";
import {Status} from "../../types/Status";
import {AvatarInput, IconButton, Input, SideBar} from '../UI';


const Title = styled.div`
  font-size: 20px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: ${props => props.theme.secondaryText};
`

const FunctionsSideBar = observer(() => {
    const {me} = useUserStore();
    const {status, startClosing, endClosing} = useFunctionsSideBarStore();
    const [uploadChatAvatar] = useSingleUploadMutation();
    const [updateProfile] = useUpdateProfileMutation();
    const [isInEditMode, setIsInEditMode] = useState(false);
    const [newName, setNewName] = useState(me!.name);

    useEffect(() => {
        if (status === Status.Closed) {
            setIsInEditMode(false);
            setNewName(me!.name);
        }
    }, [me, status]);

    if (!me) {
        return null;
    }

    const handleFileChange = async (file: File) => {
        if (file) {
            try {
                const uploadResult = await uploadChatAvatar({
                    variables: {
                        input: file
                    },
                })

                if (uploadResult.data) {
                    const updateResult = await updateProfile({
                        variables: {
                            input: {
                                avatarId: uploadResult.data.singleUpload.id,
                                name: me.name
                            }
                        }
                    });

                    if (!updateResult.data) {
                        window.alert("Не удалось обновить данные профиля!")
                    }
                } else {
                    window.alert("Не удалось загрузить файл!")
                }
            } catch (e) {
                window.alert("Не удалось загрузить файл!")
            }
        }
    }

    const switchEditMode = async () => {
        if (!isInEditMode) {
            setNewName(me.name);
            setIsInEditMode(true);
        } else {
            try {
                const updateResult = await updateProfile({
                    variables: {
                        input: {
                            name: newName,
                            avatarId: me.avatar?.id
                        }
                    }
                });

                if (!updateResult.data) {
                    window.alert("Не удалось обновить данные профиля!")
                }
                setIsInEditMode(false);
            } catch (e) {
                window.alert("Не удалось изменить имя!")
            }
        }
    }

    return (
        <SideBar status={status} onEndClosing={endClosing} onStartClosing={startClosing} header={
            <>
                <AvatarInput size={"small"} fileSrc={me.avatar?.url} alt={"my_avatar"} acceptType={"image/*"}
                             onFileChange={handleFileChange}
                />
                {isInEditMode ?
                    <Input value={newName} _type={"secondary"} onChange={(e) => setNewName(e.target.value)}
                           placeholder={"Имя"}
                           maxLength={200}/> :
                    <Title>{me.name}</Title>
                }
                <IconButton onClick={switchEditMode} _type={"secondary"}>
                    <BiPencil size={20}/>
                </IconButton>
            </>
        }>
            <FunctionsList/>
        </SideBar>
    );
});

export default FunctionsSideBar;
