import React, {FC} from 'react';
import styled, {keyframes} from "styled-components";
import {Status} from "../../types/Status";

const open = keyframes`
  from {
    transform: scale(0, 0);
  }
  to {
    transform: scale(1, 1);
  }
`

const close = keyframes`
  from {
    transform: scale(1, 1);
  }
  to {
    transform: scale(0, 0);
  }
`

const Container = styled.div`
  position: relative;
  z-index: 199;
`;

const Menu = styled.div<{ status: Status }>`
  position: absolute;
  top: 8px;
  right: 0;
  border-radius: 4px;
  background-color: ${props => props.theme.primaryBg};
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.25);

  animation-name: ${props => props.status === Status.Closing ? close : open};
  animation-duration: 300ms;

  display: flex;
  flex-direction: column;
  width: 200px;
  padding: 2px;
`

type Props = {
    status: Status,
    endClosing: () => void
}

const Dropdown: FC<Props> = ({status, children, endClosing}) => {
    if (status === Status.Closed) {
        return null
    }

    return (
        <Container>
            <Menu status={status} onAnimationEnd={endClosing}>
                {children}
            </Menu>
        </Container>
    );
};

export default Dropdown;
