import React, { useState, useEffect } from "react";
import { authService, dbService } from "fbase";
import { useHistory } from "react-router-dom";
import styles from "Profile.css"
export default ({ refreshUser, userObj }) => {
    const [memories, setMemories] = useState([]);
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [likedPhotoURL, setlikedPhotoURL] = useState([]);
    const [urlCondition, setUrlCondition] = useState(false);
    useEffect(() => {
        dbService
            .collection(userObj.uid)
            .orderBy("createdAt", "desc")
            .onSnapshot((snapshot) => {
                const memoryArray = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log(memoryArray)
                setMemories(memoryArray)
            });
    }, []);
    useEffect(() => {
        console.log(likedPhotoURL)
        console.log(urlCondition)
    }, [likedPhotoURL])
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
        history.push("/")
    };
    const onSeeMemoryClick = () => {
        var urlArray = [];
        memories.map((memory) => {
            console.log(memory.liked);
            if (memory.liked === true) {
                urlArray.push(memory.attachmentUrl);
            }
        })
        setlikedPhotoURL(urlArray);
        setUrlCondition(true)
    }
    const likedPhotoHide = () => {
        setUrlCondition(false)
    }
    const likedPhoto = (urls) => {
        let imgContent = [];
        for (var url of urls) {
            imgContent.push(<img src={ url } />)
        }
        imgContent.push(<span onClick={ likedPhotoHide } className="hideButton">hide</span>)
        return imgContent;

    };
    return (
        <div className='profileContainer'>
            <form onSubmit={ onSubmit } className='profileForm'>
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
            <button className="PhotoBtn" onClick={ onSeeMemoryClick }>추억보기</button>
            <div className="likedimg">
                { urlCondition == true &&
                    (likedPhoto(likedPhotoURL))
                }

            </div>
            <button onClick={ onLogOutClick } className="logOut">
                log out
            </button>
        </div >
    );
};
