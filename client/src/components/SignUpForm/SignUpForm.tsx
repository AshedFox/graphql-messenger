import React, {ChangeEvent, FormEvent, useState} from 'react';
import {SHA512} from "crypto-js"
import styled from "styled-components";
import {SignUpInput, useSignUpMutation} from "../../data/generated/graphql";
import {useNavigate} from "react-router-dom";
import {useUserStore} from "../../stores/userStore";
import {Form, Input} from '../UI';


const initialSignUpInput: SignUpInput = {
    email: "",
    password: "",
    name: ""
}

const Error = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.theme.optionalText};
`

const SignUpForm = () => {
    const [signUpInput, setSignUpInput] = useState(initialSignUpInput);
    const [signUp, {loading, error}] = useSignUpMutation();
    const navigate = useNavigate()
    const {setMe} = useUserStore();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSignUpInput(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const signUpResult = await signUp({
            variables: {
                input: {
                    ...signUpInput,
                    password: SHA512(signUpInput.password).toString()
                }
            }
        });

        if (!signUpResult.errors && signUpResult.data?.signUp) {
            setMe(signUpResult.data.signUp);
            navigate("/");
        }
    }

    return (
        <Form title={"Регистрация"} buttonText={"Зарегистрироваться"} withRedirectLink={true} redirectLinkTo={'/login'}
              redirectLinkText={"Уже есть аккаунт?"} onSubmit={handleSubmit} disabled={loading}
        >
            <Input _stretch _size={"big"} name={"email"} placeholder={"Email"} autoComplete={"off"}
                   autoCorrect={"off"} value={signUpInput.email} onChange={handleChange} type={"email"} required
            />
            <Input _stretch _size={"big"} type={"password"} name={"password"} placeholder={"Пароль"}
                   minLength={8} maxLength={32} required
                   autoComplete={"new-password"} autoCorrect={"off"} value={signUpInput.password}
                   onChange={handleChange}
            />
            <Input _stretch _size={"big"} name={"name"} placeholder={"Имя пользователя"}
                   minLength={3} maxLength={200} required
                   autoComplete={"name"} autoCorrect={"off"} value={signUpInput.name} onChange={handleChange}
            />
            {error && <Error>{error.message}</Error>}
        </Form>
    );
};

export default SignUpForm;
