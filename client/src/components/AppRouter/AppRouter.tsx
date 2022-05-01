import React, {useEffect} from 'react';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {useMeLazyQuery} from "../../data/generated/graphql";
import styled from "styled-components";
import {useUserStore} from "../../stores/userStore";
import MainPage from '../../pages/MainPage';
import LoginPage from '../../pages/LoginPage';
import SignUpPage from '../../pages/SignUpPage';
import {Loader} from '../UI';


const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: ${props => props.theme.primaryBg};
  transition: background-color 0.4s;
`

const AppRouter = observer(() => {
    const {me, setMe} = useUserStore();
    const [getMe, {loading, called}] = useMeLazyQuery();

    useEffect(() => {
        const queryUser = async () => {
            const result = await getMe();

            if (result.data) {
                setMe(result.data.me);
            } else {
                setMe(undefined);
            }
        }

        queryUser();
    }, [getMe, setMe]);

    if ((loading && called) || (!loading && !called)) {
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
                        <Route path={"*"} element={<Navigate to={"main"} replace={true}/>}/>
                    </Route> :
                    <Route path={"/"}>
                        <Route index element={<Navigate to={"login"}/>}/>
                        <Route path={"login"} element={<LoginPage/>}/>
                        <Route path={"sign-up"} element={<SignUpPage/>}/>
                        <Route path={"*"} element={<Navigate to={"login"} replace={true}/>}/>
                    </Route>
                }
            </Routes>
        </BrowserRouter>
    );
});

export default AppRouter;
