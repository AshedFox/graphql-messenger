import React, {ChangeEvent, FormEvent, useState} from 'react';
import {SHA512} from "crypto-js"
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import {LoginInput, useLoginMutation} from "../../data/generated/graphql";
import {useUserStore} from "../../stores/userStore";
import {Form, Input} from '../UI';

const initialLoginInput: LoginInput = {
    email: "",
    password: ""
}

const LoginForm = () => {
    const [loginInput, setLoginInput] = useState(initialLoginInput);
    const [login, {loading}] = useLoginMutation();
    const navigate = useNavigate();
    const {setMe} = useUserStore();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLoginInput(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const loginResult = await login({
                variables: {
                    input: {
                        email: loginInput.email.trim(),
                        password: SHA512(loginInput.password.trim()).toString()
                    }
                }
            });

            if (loginResult.data) {
                setMe(loginResult.data.login);
                navigate("/");
            } else {
                window.alert("Не удалось войти в аккаунт!");
            }
        } catch {
            window.alert("Не удалось войти в аккаунт!");
        }
    }

    return (
        <Form title={"Авторизация"} buttonText={"Войти"} withRedirectLink={true} redirectLinkText={"Ещё не аккаунта?"}
              redirectLinkTo={'/sign-up'} onSubmit={handleSubmit} disabled={loading}
        >
            <Input _stretch _size={"big"} name={"email"} placeholder={"Email"} autoComplete={"email"}
                   autoCorrect={"off"} value={loginInput.email} onChange={handleChange} type={"email"} required
            />
            <Input _stretch _size={"big"} type={"password"} name={"password"} placeholder={"Пароль"}
                   minLength={8} maxLength={32} required
                   autoComplete={"current-password"} autoCorrect={"off"} value={loginInput.password}
                   onChange={handleChange}
            />
        </Form>
    );
};

export default LoginForm;
