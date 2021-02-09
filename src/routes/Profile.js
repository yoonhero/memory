import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { authService, dbService, storageService } from "fbase";
import { useHistory } from "react-router-dom";
import styles from "Profile.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
export default ({ refreshUser, userObj }) => {
    const [memories, setMemories] = useState([]);
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [likedPhotoURL, setlikedPhotoURL] = useState([]);
    const [urlCondition, setUrlCondition] = useState(false);
    const [attachment, setAttachment] = useState("");
    let profileImgUrl = ""
    useEffect(() => {
        dbService
            .collection(userObj.uid)
            .orderBy("createdAt", "desc")
            .onSnapshot((snapshot) => {
                const memoryArray = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMemories(memoryArray)
            });
        dbService.collection("profile").doc(userObj.uid).get().then(function (doc) {
            if (doc.exists) {
                profileImgUrl = doc.data().attachmentUrl
                setAttachment(profileImgUrl)

            }
        })
    }, []);
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewDisplayName(value);
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName: newDisplayName,
            });
            refreshUser();
        }
        let attachmentUrl = "";
        if (attachment !== "") {
            const attachmentRef = storageService
                .ref()
                .child(`profile/${userObj.uid}`);
            const response = await attachmentRef.putString(
                attachment,
                "data_url"
            );
            attachmentUrl = await response.ref.getDownloadURL();
            await dbService.doc(`profile/${userObj.uid}`).delete();

        }

        const profileArray = {
            id: userObj.uid,
            attachmentUrl,
        }
        await dbService.collection("profile").doc(userObj.uid).set(profileArray)
        history.push("/")
    };
    const onFileChange = (event) => {
        const {
            target: { files },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };
    const onClearAttachment = () => setAttachment(null);

    return (

        <div className='profileContainer'>
            <form onSubmit={ onSubmit } className='profileForm'>

                <label for="attach-file" className="PofileInput__label">

                    <div className="img-thumbnail img-circle">
                        <div>
                            { attachment ? (

                                <img className="profileImg" src={ attachment } />
                            ) : (
                                    <img className="profileImg" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />

                                ) }

                            <span className="span_upload">UPLOAD</span>
                        </div>
                    </div>
                </label>
                <input
                    id="attach-file"
                    type="file"
                    accept="image/*"
                    onChange={ onFileChange }
                    style={ {
                        opacity: 0,
                    } }
                />

                <input
                    onChange={ onChange }
                    type='text'
                    autoFocus
                    placeholder='Display name'
                    value={ newDisplayName }
                    className='formInput'
                />
                <input
                    type='submit'
                    value='Update Profile'
                    className='formBtn'
                />
            </form>

            <button onClick={ onLogOutClick } className="logOut">
                log out
            </button>
        </div >
    );
};
