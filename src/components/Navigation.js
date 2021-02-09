import React, { useEffect, useState } from 'react';
import { dbService, authService } from "fbase";
import { Link } from "react-router-dom";
import Memory from "components/Memory";
import styles from "Navigation.css"
import { useHistory } from "react-router-dom";
import { faUser, faStar } from "@fortawesome/free-solid-svg-icons"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const Navigation = ({ userObj }) => {
    const [attachment, setAttachment] = useState("");
    const history = useHistory();
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };
    useEffect(() => {
        dbService.collection("profile").doc(userObj.uid).get().then(function (doc) {
            if (doc.exists) {
                const profileImgUrl = doc.data().attachmentUrl
                setAttachment(profileImgUrl)

            }
        })
    }, []);
    return (

        <>
            <Link to="/" className="navTitle">Memory</Link>
            <nav>
                <span className="navProfile">
                    { attachment !== "" ? (
                        <img src={ attachment } className="profileMainImg" />
                    ) : (
                            <FontAwesomeIcon icon={ faUser } size="2x" />
                        ) }

                    <div className="dropdown-content">
                        <Link to="/likedPictures">
                            <button>likePicture</button>
                        </Link>
                        <br />
                        <Link to="/profile">
                            <button>Profile</button>
                        </Link>

                        <br />
                        <button onClick={ onLogOutClick } className="logOutBtn">Logout</button>

                    </div>
                </span>

            </nav>
        </>
    );
}


export default Navigation;