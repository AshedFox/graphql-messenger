import styled, {css} from "styled-components";

type Props = {
    _size?: "small" | "medium" | "big";
    _stretch?: boolean;
    _type?: "primary" | "secondary";
}

export default styled.textarea<Props>`
  ${props => {
    switch (props._size) {
      case "small": {
        return css`
          font-size: 13px;
          padding: 5px 8px;

          &::placeholder {
            font-size: 12px;
          }
        `
      }

      case "medium":
      default: {
        return css`
          font-size: 15px;
          padding: 6px 10px;

          &::placeholder {
            font-size: 14px;
          }
        `
      }
      case "big": {
        return css`
          font-size: 17px;
          padding: 8px 12px;

          &::placeholder {
            font-size: 16px;
          }
        `
      }
    }
  }};
  flex-grow: ${props => props._stretch ? "1" : "initial"};
  resize: none;
  outline: none;
  border: none;
  border-radius: 2px;

  color: ${props => props.theme.primaryText};
  background-color: ${props => (props._type ?? "primary") === "primary" ? props.theme.uiPrimaryBg : props.theme.uiSecondaryBg};

  transition: background-color ease 0.4s, color ease 0.4s;

  &::placeholder {
    color: ${props => props.theme.optionalText}
  }


  ::-webkit-scrollbar {
    width: 10px;
  }
  
  ::-webkit-scrollbar-track {
    background: transparent;
    margin: 2px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => `${props.theme.secondaryBg}81`};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${props => `${props.theme.uiSecondaryHoverBg}81`};
  }
`;
