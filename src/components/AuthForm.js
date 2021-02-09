import React, { useState } from "react";
import { authService } from "fbase";
import styles from "Auth.css"
const inputStyles = {};
const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(false);
    const [error, setError] = useState("");
    const onChange = (event) => {
        const {
            target: { name, value },
        } = event;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
            if (newAccount) {
                data = await authService.createUserWithEmailAndPassword(
                    email,
                    password
                );
            } else {
                data = await authService.signInWithEmailAndPassword(
                    email,
                    password
                );
            }
            console.log(data);
        } catch (error) {
            setError(error.message);
        }
    };
    const toggleAccount = () => setNewAccount((prev) => !prev);
    return (
        <>
            <form onSubmit={ onSubmit } className="authFormContainer">
                <input
                    name='email'
                    type='email'
                    placeholder='Email'
                    required
                    value={ email }
                    onChange={ onChange }
                    className="authInput"
                />
                <input
                    name='password'
                    type='password'
                    placeholder='Password'
                    required
                    value={ password }
                    onChange={ onChange }
                    className="authInput"
                />
                <input
                    type='submit'
                    className="authInput authSubmit"
                    value={ newAccount ? "가입하기" : "기억 속으로" }
                />
                { error && <span className="authError">{ error }</span> }
            </form>
            <span onClick={ toggleAccount } className="authSwitch">
                { newAccount ? "로그인" : (<span>계정이 없다면 가입하기</span>) }
            </span>
        </>
    );
};
export default AuthForm;
