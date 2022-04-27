import React, {ReactNode} from 'react';
import styled from "styled-components";

const Wrapper = styled.div<{ selected?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 30px;
  gap: 10px;
  
  cursor: pointer;
  
  background-color: ${props => props.selected ? `${props.theme.uiPrimaryFocusBg} !important` : props.theme.uiPrimaryBg};
  border-radius: 2px;
  transition: 0.4s;
  
  &:hover {
    background-color: ${props => props.theme.uiPrimaryHoverBg};
  }
`

const Text = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.primaryText};
`

const Icon = styled.div`
  color: ${props => props.theme.primaryText};
`

type Props = {
    icon: ReactNode;
    text: string;
    onClick: () => void;
};

const Function = ({text, icon, onClick}: Props) => {
    return (
        <Wrapper onClick={onClick}>
            <Icon>{icon}</Icon>
            <Text>{text}</Text>
        </Wrapper>
    );
};

export default Function;
