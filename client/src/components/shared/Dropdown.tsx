import React, {FC} from 'react';
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  z-index: 199;
`;

const Menu = styled.div`
  position: absolute;
  top: 8px;
  right: 0;
  border-radius: 4px;
  background-color: ${props => props.theme.secondaryBg};
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.25);

  display: flex;
  flex-direction: column;
  width: 200px;
  padding: 2px;
`

type Props = {
    isOpen: boolean
}

const Dropdown: FC<Props> = ({isOpen, children}) => {
    if (!isOpen) {
        return null
    }

    return (
        <Wrapper>
            <Menu>
                {children}
            </Menu>
        </Wrapper>
    );
};

export default Dropdown;
