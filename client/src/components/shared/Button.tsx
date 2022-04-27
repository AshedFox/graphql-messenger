import React, {FC} from 'react';
import styled, {css} from "styled-components";


type Props = {
    _size?: "small" | "medium" | "big";
    _primary?: boolean;
    _stretch?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}


const Wrapper = styled.button<Props>`
  ${props => {
    switch (props._size) {
      case "small": {
        return css`
          padding: 4px 8px;
          font-size: 14px;
        `
      }
      case "medium":
      default: {
        return css`
          padding: 6px 10px;
          font-size: 16px;
        `
      }
      case "big": {
        return css`
          padding: 9px 14px;
          font-size: 20px;
        `
      }
    }
  }};
  flex-grow: ${props => props._stretch ? "1" : "initial"};

  display: flex;
  align-items: center;
  justify-content: center;
  height: fit-content;
  width: fit-content;

  background-color: ${props => props._primary ? props.theme.primaryBg : props.theme.secondaryBg};
  color: ${props => props._primary ? props.theme.primaryText : props.theme.secondaryText};
  border-radius: 4px;
  cursor: pointer;
  border: none;
  outline: none;
  transition: 0.4s;

  &:hover {
    background-color: ${props => props._primary ? props.theme.uiPrimaryHoverBg : props.theme.uiSecondaryHoverBg};
  }

  &:disabled {
    cursor: not-allowed;
    background-color: ${props => props._primary ? props.theme.primaryBg : props.theme.secondaryBg};
  }
`;

const Button: FC<Props> = (props) => {
    return <Wrapper {...props}/>
};

export default Button;
