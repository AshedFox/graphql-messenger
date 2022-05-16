import React, {useEffect, useState} from 'react';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {useMeLazyQuery} from "../../data/generated/graphql";
import styled from "styled-components";
import {useUserStore} from "../../stores/userStore";
import MainPage from '../../pages/MainPage';
import LoginPage from '../../pages/LoginPage';
import SignUpPage from '../../pages/SignUpPage';
import {Loader} from '../UI';
import InvitePage from "../../pages/InvitePage";


const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: ${props => props.theme.primaryBg};
  transition: background-color 0.4s;
`

const AppRouter = observer(() => {
    const {me, setMe} = useUserStore();
    const [getMe] = useMeLazyQuery();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const queryUser = async () => {
            try {
                const result = await getMe({
                    fetchPolicy: "no-cache"
                });

                if (result.data) {
                    setMe(result.data.me);
                } else {
                    setMe(undefined);
                }
            } catch {
                setMe(undefined);
            }
        }

        queryUser().finally(() => setLoading(false));
    }, [getMe, setMe]);

    if (loading) {
        return (
            <Container>
                <Loader stretch={true} size={60}/>
            </Container>
        )
    }

    return (
        <BrowserRouter>
            <Routes>
                {me ?
                    <Route path={"/"}>
                        <Route index element={<Navigate to={"main"}/>}/>
                        <Route path={"main"} element={<MainPage/>}/>
                        <Route path={"invite/:token"} element={<InvitePage/>}/>
                        <Route path={"*"} element={<Navigate to={"main"} replace/>}/>
                    </Route> :
                    <Route path={"/"}>
                        <Route index element={<Navigate to={"login"}/>}/>
                        <Route path={"login"} element={<LoginPage/>}/>
                        <Route path={"sign-up"} element={<SignUpPage/>}/>
                        <Route path={"*"} element={<Navigate to={"login"} replace/>}/>
                    </Route>
                }
            </Routes>
        </BrowserRouter>
    );
});

export default AppRouter;
