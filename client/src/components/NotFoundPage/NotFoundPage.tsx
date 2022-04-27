import React from 'react';
import styled from "styled-components";
import {GiSadCrab} from "react-icons/gi";
import Button from "../shared/Button";
import {Link} from "react-router-dom";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${props => props.theme.primaryBg};
  transition: 0.4s;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 100%;
  width: 100%;
`

const Text = styled.div`
  font-size: 42px;
  font-weight: 600;
  color ${props => props.theme.primaryText};
`

const NotFoundPage = () => {
    return (
        <Wrapper>
            <Content>
                <GiSadCrab size={200} color={"red"}/>
                <Text>{"Ах! Как же так! Страница не найдена :("}</Text>
                <Button _size={"big"}>
                    <Link to={"/"}>Перейти на главную страницу</Link>
                </Button>
            </Content>
        </Wrapper>
    );
};

export default NotFoundPage;
