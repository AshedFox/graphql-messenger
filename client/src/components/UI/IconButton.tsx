import styled from "styled-components";

type Props = {
    _type?: "primary" | "secondary";
}

export default styled.button<Props>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: fit-content;
  width: fit-content;
  
  background-color: transparent;
  color: ${props => (props._type ?? "primary") === "primary" ? props.theme.primaryText : props.theme.secondaryText};
  cursor: pointer;
  border: none;
  outline: none;
  transition: 0.4s;
  
  &:hover {
    color: ${props => (props._type ?? "primary") === "primary" ? props.theme.uiSecondaryHoverBg : props.theme.uiPrimaryHoverBg};
  }
`;
