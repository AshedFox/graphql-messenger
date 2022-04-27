import styled, {css} from "styled-components";


const Container = styled.div<Props>`
  ${props => {
    switch (props._size) {
      case "small": {
        return css`
          width: 32px;
          height: 32px;
        `
      }
      case "medium":
      default: {
        return css`
          width: 56px;
          height: 56px;
        `
      }
      case "big": {
        return css`
          width: 80px;
          height: 80px;
        `
      }
    }
  }};

  cursor: ${props => props.onClick ? "pointer" : "default"};
  user-select: none;

  border-radius: 50%;
  overflow: hidden;
  background-color: ${props => props.theme.optionalText};
`

const Image = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
`

type Props = {
    _size?: "small" | "medium" | "big";
    src?: string;
    alt?: string;
    _stretch?: boolean;
    onClick?: () => void;
}

const Avatar = (props: Props) => {
    return (
        <Container {...props}>
            {props.src && <Image src={props.src} alt={props.alt}/>}
        </Container>
    );
};

export default Avatar;
