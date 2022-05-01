import styled, {css} from "styled-components";

type Props = {
    _size?: "small" | "medium" | "big";
    _stretch?: boolean;
    _type?: "primary" | "secondary";
}

export default styled.input<Props>`
  ${props => {
    switch (props._size) {
        case "small": {
            return css`
          font-size: 13px;
          height: 20px;
          padding: 0 8px;

          &::placeholder {
            font-size: 12px;
          }
        `
        }

        case "medium":
        default: {
            return css`
          font-size: 15px;
          height: 31px;
          padding: 0 10px;

          &::placeholder {
            font-size: 14px;
          }
        `
        }
        case "big": {
            return css`
          font-size: 17px;
          height: 42px;
          padding: 0 12px;

          &::placeholder {
            font-size: 16px;
          }
        `
        }
    }
}};
  flex-grow: ${props => props._stretch ? "1" : "initial"};
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  border: none;
  border-radius: 2px;
  min-width: 0;

  color: ${props => props.theme.primaryText};
  background-color: ${props => (props._type ?? "primary") === "primary" ? props.theme.uiPrimaryBg : props.theme.uiSecondaryBg};

  transition: background-color ease 0.4s, color ease 0.4s;

  &::placeholder {
    color: ${props => props.theme.optionalText}
  }

  &:-webkit-autofill, :-webkit-autofill:hover, :-webkit-autofill:focus, :-webkit-autofill:active {
    background-color: ${props => (props._type ?? "primary") === "primary" ? props.theme.uiPrimaryHoverBg : props.theme.uiSecondaryHoverBg} !important;
    color: ${props => props.theme.primaryText} !important;
    -webkit-box-shadow: 0 0 0 90px ${props => (props._type ?? "primary") === "primary" ? props.theme.uiPrimaryHoverBg : props.theme.uiSecondaryHoverBg} inset !important;
    -webkit-text-fill-color: ${props => props.theme.primaryText} !important;
    background-clip: content-box;
    caret-color: ${props => props.theme.primaryText};
  }
`;
