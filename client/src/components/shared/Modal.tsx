import React, {FC, ReactNode} from 'react';
import styled, {keyframes} from "styled-components";
import {CgClose} from "react-icons/cg";
import IconButton from "./IconButton";

export enum ModalStatus {
    Closed,
    Closing,
    Open
}

const open = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const close = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`

const slideInLeft = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`

const slideOutLeft = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
`

const Wrapper = styled.div<{ status: ModalStatus }>`
  z-index: 10000;
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: ${props => `${props.theme.secondaryBg}32`};

  animation-name: ${props => {
    if (props.status === ModalStatus.Closing) {
      return close;
    } else {
      return open;
    }
  }};
  animation-duration: 300ms;
  animation-direction: alternate;
`

const Content = styled.div<{ status: ModalStatus }>`
  position: relative;
  display: flex;
  flex-direction: column;
  margin: auto;
  min-width: 320px;
  max-height: 70%;
  background-color: ${props => props.theme.primaryBg};
  border-radius: 4px;

  animation-name: ${props => props.status === ModalStatus.Closing ? slideOutLeft : slideInLeft};
  animation-duration: 300ms;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px;
  border-bottom: ${props => props.theme.uiPrimaryBg} 1px solid;
`

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.primaryText};
`

const CloseButton = styled(IconButton)`
  margin-left: auto;
`

const Main = styled.div`
  padding: 5px;
  display: flex;
  overflow-y: hidden;
  //overflow-y: scroll;
`

const Footer = styled.div`
  padding: 10px;
  display: flex;
  border-top: ${props => props.theme.uiPrimaryBg} 1px solid;
`


type Props = {
    title?: string,
    status: ModalStatus,
    onStartClosing?: () => void,
    onEndClosing?: () => void,
    footer?: ReactNode
}

const Modal: FC<Props> = ({
                              title, children, status,
                              onStartClosing, onEndClosing, footer
                          }) => {
    if (status === ModalStatus.Closed) {
        return null;
    }

    return (
        <Wrapper status={status} onClick={onStartClosing}>
            <Content status={status} onClick={(e) => e.stopPropagation()}
                     onAnimationEnd={onEndClosing}>
                <Header>
                    {title && <Title>{title}</Title>}
                    <CloseButton onClick={onStartClosing} _primary={true}>
                        <CgClose size={24}/>
                    </CloseButton>
                </Header>
                <Main>{children}</Main>
                <Footer>{footer}</Footer>
            </Content>
        </Wrapper>
    );
};

export default Modal;
