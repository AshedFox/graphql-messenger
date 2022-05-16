import React, {ChangeEvent, FormEvent, useState} from 'react';
import {SHA512} from "crypto-js"
import {SignUpInput, useSignUpMutation} from "../../data/generated/graphql";
import {useNavigate} from "react-router-dom";
import {useUserStore} from "../../stores/userStore";
import {Form, Input} from '../UI';


const initialSignUpInput: SignUpInput = {
    email: "",
    password: "",
    name: ""
}

const SignUpForm = () => {
    const [signUpInput, setSignUpInput] = useState(initialSignUpInput);
    const [signUp, {loading}] = useSignUpMutation();
    const navigate = useNavigate()
    const {setMe} = useUserStore();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSignUpInput(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const signUpResult = await signUp({
                variables: {
                    input: {
                        name: signUpInput.name.trim(),
                        email: signUpInput.email.trim(),
                        password: SHA512(signUpInput.password.trim()).toString()
                    }
                }
            });

            if (signUpResult.data) {
                setMe(signUpResult.data.signUp);
                navigate("/");
            } else {
                window.alert("Не удалось зарегистрироваться!")
            }
        } catch {
            window.alert("Не удалось зарегистрироваться!")
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
        </Form>
    );
};

export default SignUpForm;
