import styled from "styled-components";

type Props = {
    _primary?: boolean;
}


export default styled.button<Props>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: fit-content;
  width: fit-content;
  
  background-color: transparent;
  color: ${props => props._primary ? props.theme.primaryText : props.theme.secondaryText};
  cursor: pointer;
  border: none;
  outline: none;
  transition: 0.4s;
  
  &:hover {
    color: ${props => props._primary ? props.theme.uiSecondaryHoverBg : props.theme.uiPrimaryHoverBg};
  }
`;
