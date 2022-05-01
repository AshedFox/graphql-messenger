import React from 'react';
import styled, {css, keyframes} from "styled-components";

type Props = {
    size?: number;
    stretch?: boolean;
}

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Container = styled.div<Props>`
  ${props => props.stretch && css`margin: auto`};
  animation: ${rotate360} 1s linear infinite;
  transform: translateZ(0);
  
  border-top: 2px solid grey;
  border-right: 2px solid grey;
  border-bottom: 2px solid grey;
  border-left: 4px solid black;
  background: transparent;
  width: ${props => props.size ? `${props.size}px` : "30px"};
  height: ${props => props.size ? `${props.size}px` : "30px"};
  border-radius: 50%;
`;

const Loader = (props: Props) => {
    return <Container {...props}/>
};

export default Loader;
