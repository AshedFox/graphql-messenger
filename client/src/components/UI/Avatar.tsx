import styled, {css} from "styled-components";


const Container = styled.div<{ size?: "small" | "medium" | "big", onClick?: () => void }>`
  ${props => {
    switch (props.size) {
        case "small": {
            return css`
          width: 32px;
          height: 32px;
          min-width: 32px;
          min-height: 32px;
        `
        }
        case "medium":
        default: {
            return css`
          width: 56px;
          height: 56px;
          min-width: 56px;
          min-height: 56px;
        `
        }
        case "big": {
            return css`
          width: 80px;
          height: 80px;
          min-width: 80px;
          min-height: 80px;
        `
        }
    }
}};

  cursor: ${props => props.onClick ? "pointer" : "default"};
  user-select: none;

  border-radius: 50%;
  overflow: hidden;
  background-color: ${props => props.theme.uiSecondaryBg};
  //box-shadow: 1px 1px 1px 1px ${props => `${props.theme.secondaryBg}30`};
  border: 1px solid ${props => `${props.theme.secondaryBg}30`};
`

const Image = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
`

type Props = {
    size?: "small" | "medium" | "big";
    src?: string;
    alt?: string;
    onClick?: () => void;
}

const Avatar = (props: Props) => {
    return (
        <Container size={props.size} onClick={props.onClick}>
            {props.src && <Image src={props.src} alt={props.alt}/>}
        </Container>
    );
};

export default Avatar;
