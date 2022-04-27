import React, {FC, FormEvent} from 'react';
import styled from "styled-components";
import {Link} from "react-router-dom";
import Button from "./Button";

const Wrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  width: 500px;
  gap: 36px;
`

const Title = styled.div`
  font-weight: 700;
  font-size: 36px;
  color: ${props => props.theme.primaryText};
`

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  height: auto;
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
`

const RedirectLink = styled(Link)`
  font-size: 13px;
  text-decoration: underline;
  color: ${props => props.theme.primaryText};
`
type Props = {
    title: string,
    buttonText: string,
    onSubmit: (e: FormEvent) => void,
    disabled?: boolean
} & RedirectLinkProps;

type RedirectLinkProps =
    | { withRedirectLink: true, redirectLinkText: string, redirectLinkTo: string }
    | { withRedirectLink: false, redirectLinkText?: never, redirectLinkTo?: never }

const Form: FC<Props> = ({
                             children, redirectLinkText,
                             redirectLinkTo, withRedirectLink, buttonText,
                             title, onSubmit, disabled
                         }) => {
    return (
        <Wrapper onSubmit={onSubmit}>
            <Title>{title}</Title>
            <Fields>{children}</Fields>
            <Footer>
                {withRedirectLink && <RedirectLink to={redirectLinkTo}>{redirectLinkText}</RedirectLink>}
                <Button disabled={disabled} _stretch _size={"big"}>{buttonText}</Button>
            </Footer>
        </Wrapper>
    );
};

export default Form;
