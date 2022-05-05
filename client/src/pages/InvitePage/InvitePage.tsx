import React, {useEffect, useState} from 'react';
import {Button, Loader} from "../../components/UI";
import {useActivateInviteMutation, useCheckInviteLazyQuery} from "../../data/generated/graphql";
import {useNavigate, useParams} from "react-router-dom";
import styled from "styled-components";
import {AiFillHeart} from 'react-icons/ai';
import {ImSad} from "react-icons/im";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`

const Image = styled.img`
  position: absolute;
  filter: grayscale(90%) blur(3px);
  z-index: -1;
  object-fit: cover;
  height: 100%;
  width: 100%;
`

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  padding: 40px;
  border-radius: 5px;
  background-color: ${props => props.theme.primaryBg};
`

const InfoMessage = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: ${props => props.theme.primaryText};
`

const InvitePage = () => {
    const {token} = useParams<{token: string}>();
    const [activateInviteMutation] = useActivateInviteMutation();
    const [checkInviteQuery] = useCheckInviteLazyQuery();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>()
    const navigate = useNavigate();

    const activateInvite = async () => {
        if (token) {
            try {
                const res = await activateInviteMutation({
                    variables: {
                        token
                    }
                });

                if (res.data && res.data.activateInvite) {
                    navigate("/");
                }
            } catch {
                window.alert("Что-то пошло не так!");
            }
        }
    }

    useEffect(() => {
        setError("");
        setLoading(true);
        const checkInvite = async () => {
            if (token) {
                try {
                    const res = await checkInviteQuery({
                        variables: {
                            token: token
                        }
                    });

                    if (!res.data || !res.data.checkInvite) {
                        setError("Приглашение не действительно")
                    }
                } catch {
                    setError("Приглашение не действительно")
                }
            } else {
                setError("Нет приглашения");
            }
        }
        checkInvite().finally(() => setLoading(false))
    }, [])

    return (
        <Container>
            <Image src={require("../../assets/images/invite-bg.png")}/>
            <Content>
                {loading ?
                    <Loader/> :
                    error ?
                        <>
                            <ImSad color={"red"} size={180}/>
                            <InfoMessage>{error}</InfoMessage>
                        </> :
                        <>
                            <AiFillHeart color={"red"} size={180}/>
                            <Button _type={"secondary"} _size={"big"} onClick={activateInvite}>
                                {"Присоединиться по приглашению!"}
                            </Button>
                        </>
                }
            </Content>
        </Container>
    );
};

export default InvitePage;
