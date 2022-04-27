import React, {FC, ReactNode} from 'react';
import styled, {keyframes} from "styled-components";
import IconButton from "./IconButton";
import {CgClose} from "react-icons/cg";

export enum SideBarStatus {
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

const slideInRight = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
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

const slideOutRight = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
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

const Wrapper = styled.div<{ status: SideBarStatus, side?: "left" | "right" }>`
  z-index: 9999;
  position: fixed;

  width: 100vw;
  height: 100vh;
  background-color: ${props => `${props.theme.secondaryBg}32`};

  animation-name: ${props => {
    if (props.status === SideBarStatus.Closing) {
      return close;
    } else {
      return open;
    }
  }};
  animation-duration: 300ms;
  animation-direction: alternate;
`

const Content = styled.div<{ status: SideBarStatus, side?: "left" | "right" }>`
  position: relative;
  width: 360px;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-left: ${props => props.side ? props.side === "left" ? 0 : "auto" : 0};

  background-color: ${props => props.theme.primaryBg};

  animation-name: ${props => {
    if (props.status === SideBarStatus.Closing) {
      return props.side ? props.side === "left" ? slideOutLeft : slideOutRight : slideOutLeft
    } else {
      return props.side ? props.side === "left" ? slideInLeft : slideInRight : slideInLeft;
    }
  }};
  animation-duration: 300ms;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  background-color: ${props => props.theme.secondaryBg};
  padding: 0 30px;
  gap: 15px;
`

const CloseButton = styled(IconButton)`
  margin-left: auto;
`

const Main = styled.div`
  padding: 3px;
  flex: 1;

  display: flex;
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  background-color: ${props => props.theme.secondaryBg};
  padding: 0 30px;
`

type Props = {
    side?: "left" | "right",
    status: SideBarStatus,
    onStartClosing?: () => void,
    onEndClosing?: () => void,
    header?: ReactNode,
    footer?: ReactNode
};

const SideBar: FC<Props> = ({
                                children, side, header,
                                footer, onStartClosing,
                                onEndClosing, status
                            }) => {
    if (status === SideBarStatus.Closed) {
        return null;
    }

    return (
        <Wrapper status={status} side={side} onClick={onStartClosing}>
            <Content status={status} side={side} onClick={(e) => e.stopPropagation()}
                     onAnimationEnd={onEndClosing}
            >
                <Header>
                    {header}
                    <CloseButton onClick={onStartClosing}>
                        <CgClose size={24}/>
                    </CloseButton>
                </Header>
                <Main>
                    {children}
                </Main>
                <Footer>
                    {footer}
                </Footer>
            </Content>
        </Wrapper>
    );
};

export default SideBar;
