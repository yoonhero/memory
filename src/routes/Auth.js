import React from "react";
import { authService, firebaseInstance } from "fbase";
import AuthForm from "components/AuthForm";
import styles from "Auth.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGoogle,
} from "@fortawesome/free-brands-svg-icons";
const Auth = () => {
    const onSocialClick = async (event) => {
        const {
            target: { name },
        } = event;
        let provider;
        if (name === "google") {
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        }
        await authService.signInWithPopup(provider);
    };

    return (
        <div className="authDiv">
            <div className="authTitle">
                <h1>Memory</h1>
            </div>
            <div className="authContainer">
                <AuthForm />
                <div>
                    <div className="authBtns">
                        <button onClick={ onSocialClick } name="google" className="authBtn">
                            <FontAwesomeIcon icon={ faGoogle } />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
