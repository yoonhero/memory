import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import styles from "Profile.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
export default ({ userObj }) => {
    const [likedPhotoURL, setlikedPhotoURL] = useState([]);
    const [urlCondition, setUrlCondition] = useState(false);
    const [memories, setMemories] = useState([]);

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

    }, []);

    useEffect(() => {
        var urlArray = [];
        memories.map((memory) => {
            console.log(memory.liked);
            if (memory.liked === true) {
                urlArray.push(memory.attachmentUrl);
            }
        })
        console.log(urlArray)
        setlikedPhotoURL(urlArray);
        setUrlCondition(true)
    }, [memories])

    const likedPhoto = (urls) => {
        let imgContent = [];
        for (var url of urls) {
            imgContent.push(<img src={ url } />)
        }
        return imgContent;

    };
    const onSeeMemoryClick = () => {

    }

    return (
        <>
            <div className="likedimg">
                { urlCondition == true &&
                    (likedPhoto(likedPhotoURL))
                }

            </div>
        </>
    )
}