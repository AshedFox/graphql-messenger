import React, {FC, useState} from 'react';
import {Button, IconButton, Input, Modal} from "../UI";
import {observer} from "mobx-react-lite";
import {useInvitesModalStore} from "../../stores/invitesModalStore";
import {
    ChatInviteUsageTerm,
    GenerateChatInviteInput,
    useGenerateInviteMutation,
    useRemoveInviteMutation
} from "../../data/generated/graphql";
import {ChatInviteModel} from "../../types/models";
import styled from "styled-components";
import Select from "../UI/Select";
import {mapChatInviteUsageTerm} from "../../services/enumMapper";
import {CgClose} from "react-icons/cg";

const InfoMessage = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.theme.optionalText};
`

const Label = styled.label`
  font-size: 15px;
  font-weight: 500;
  color: ${props => props.theme.primaryText};
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 20px;
  padding: 10px;
`

const Ref = styled.a`
  color: darkcyan;
  font-weight: 600;
  font-style: italic;
  font-size: 15px;
`

const Info = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.theme.primaryText};
`

const Header = styled.div`
  display: grid;
  grid-template-columns: auto 160px 120px;
  gap: 15px;
`

const Invite = styled.div`
  display: grid;
  background-color: ${props => props.theme.uiPrimaryBg};
  padding: 10px;
  border-radius: 3px;
  grid-template-columns: auto 160px 120px;
  justify-items: center;
  gap: 15px;
  position: relative;
`

const RemoveButton = styled(IconButton)`
  position: absolute;
  right: -7px;
  top: -7px;
`

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  width: 100%;
`

const FooterBlock = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

type Props = {
    chatId: string,
    invites: ChatInviteModel[]
}

const initialInviteInput: GenerateChatInviteInput = {
    usageTerm: ChatInviteUsageTerm.ThirtyMinutes,
    maxUses: 1,
    chatId: ""
}

const InvitesModal: FC<Props> = observer(({chatId, invites}) => {
    const {status, startClosing, endClosing} = useInvitesModalStore();
    const [generateInviteMutation] = useGenerateInviteMutation();
    const [removeInviteMutation] = useRemoveInviteMutation();
    const [input, setInput] = useState(initialInviteInput);
    const [error, setError] = useState<string>();

    const generateInvite = async () => {
        setError(undefined);

        try {
            const res = await generateInviteMutation({
                variables: {
                    input: {
                        ...input,
                        chatId,
                    }
                }
            });

            if (!res.data || !res.data.generateInvite) {
                setError("Не удалось создать приглашение");
            }
        } catch {
            setError("Не удалось создать приглашение");
        }
    }

    const removeInvite = async (id: string) => {
        if (window.confirm("Вы дествительно хотите удалить приглашение?")) {
            setError(undefined);

            try {
                const res = await removeInviteMutation({
                    variables: {
                        id
                    }
                });

                if (!res.data || !res.data.removeInvite) {
                    setError("Не удалось удалить приглашение");
                }
            } catch {
                setError("Не удалось удалить приглашение");
            }
        }
    }

    return (
        <Modal status={status} title={"Приглашения"} footer={
            <Footer>
                <FooterBlock>
                    <Label>Период действия:</Label>
                    <Select onChange={(e) => setInput(prev => ({...prev, usageTerm: e.target.value as ChatInviteUsageTerm}))}
                            value={input.usageTerm} style={{textAlign:"right", marginLeft: "auto"}}
                    >
                        <option value={ChatInviteUsageTerm.ThirtyMinutes}>{mapChatInviteUsageTerm(ChatInviteUsageTerm.ThirtyMinutes)}</option>
                        <option value={ChatInviteUsageTerm.OneHour}>{mapChatInviteUsageTerm(ChatInviteUsageTerm.OneHour)}</option>
                        <option value={ChatInviteUsageTerm.TwelveHours}>{mapChatInviteUsageTerm(ChatInviteUsageTerm.TwelveHours)}</option>
                        <option value={ChatInviteUsageTerm.OneDay}>{mapChatInviteUsageTerm(ChatInviteUsageTerm.OneDay)}</option>
                        <option value={ChatInviteUsageTerm.SevenDays}>{mapChatInviteUsageTerm(ChatInviteUsageTerm.SevenDays)}</option>
                        <option value={ChatInviteUsageTerm.ThirtyDays}>{mapChatInviteUsageTerm(ChatInviteUsageTerm.ThirtyDays)}</option>
                        <option value={ChatInviteUsageTerm.Infinite}>{mapChatInviteUsageTerm(ChatInviteUsageTerm.Infinite)}</option>
                    </Select>
                </FooterBlock>
                <FooterBlock>
                    <Label>Количество использований: </Label>
                    <Input type={"number"} value={input.maxUses ?? ""} min={1} max={100000} pattern={"[0-9]*"}
                           style={{textAlign:"right", marginLeft: "auto"}} onChange={(e) => {
                               if (e.target.value === "") {
                                   setInput(prev => ({...prev, maxUses: undefined}))
                               } else {
                                   const number = Math.max(
                                       Math.min(
                                           Number.parseInt(e.target.value),
                                           Number.parseInt(e.target.max)
                                       ),
                                       Number.parseInt(e.target.min)
                                   );
                                   setInput(prev => ({...prev, maxUses: number}))
                               }
                           }}
                    />
                </FooterBlock>
                <Button _stretch _type={"secondary"} onClick={generateInvite}>Создать новое приглашение</Button>
                {error && <InfoMessage>Не удалось создать приглашение</InfoMessage>}
            </Footer>
        } startClosing={startClosing} endClosing={endClosing}>
            <Content>
                {invites.length === 0 ?
                    <InfoMessage>Пока нет приглашений</InfoMessage> :
                    <>
                        <Header>
                            <Info style={{fontWeight:"600"}}>Ссылка</Info>
                            <Info style={{fontWeight:"600"}}>Дата истечения</Info>
                            <Info style={{fontWeight:"600"}}>Осталось использований</Info>
                        </Header>
                        {invites.map(invite => (
                            <Invite key={invite.token}>
                                <Ref href={`${window.location.origin}/invite/${invite.token}`}>{invite.token}</Ref>
                                <Info>{invite.expiredAt ? new Date(invite.expiredAt).toLocaleString() : "-"}</Info>
                                <Info>{invite.leftUses ?? "Неограничено"}</Info>
                                <RemoveButton onClick={() => removeInvite(invite.id)}>
                                    <CgClose size={18}/>
                                </RemoveButton>
                            </Invite>
                        ))}
                    </>
                }
            </Content>
        </Modal>
    );
});

export default InvitesModal;
