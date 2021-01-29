import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import styles from "Memory.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { faStar } from "@fortawesome/free-regular-svg-icons"
const Memory = ({ userObj, memoryObj }) => {
    const [editing, setEditing] = useState(false);
    const [newMemoryTitle, setNewMemoryTitle] = useState(memoryObj.title);
    const [newMemoryDef, setNewMemoryDef] = useState(memoryObj.def);
    const onDeleteClick = async () => {
        const ok = window.confirm(
            "정말로 당신의 기억을 삭제하시겠습니까?"
        );
        if (ok) {
            await dbService.doc(`${userObj.uid}/${memoryObj.id}`).delete();
            if (memoryObj.attachmentUrl !== "") {
                await storageService
                    .refFromURL(memoryObj.attachmentUrl)
                    .delete();
            }
        }
    };
    const onLikedClick = async () => {
        if (memoryObj.liked === null) {
            return;
        }
        if (memoryObj.liked === true) {
            await dbService.doc(`${userObj.uid}/${memoryObj.id}`).update({
                liked: false,
            });
        } else if (memoryObj.liked === false) {
            await dbService.doc(`${userObj.uid}/${memoryObj.id}`).update({
                liked: true,
            });
            console.log("liked")
        }
    }
    return (
        <div className="memoryCard">

            <div className="memoryImg">
                { memoryObj.attachmentUrl && <img src={ memoryObj.attachmentUrl }
                /> }
            </div>

            <div className="components">
                <h4>{ memoryObj.title }</h4>
                <p>{ memoryObj.def }</p>
                { memoryObj.liked == true ? (
                    <span onClick={ onLikedClick } className="likedPic liked"><FontAwesomeIcon icon={ faStar } size="2x" /></span>
                )
                    : <span onClick={ onLikedClick } className="likedPic"><FontAwesomeIcon icon={ faStar } size="2x" /></span>
                }

                { memoryObj.date && <span className="componentDate">{ memoryObj.date }</span> }

                <h3 onClick={ onDeleteClick } clsasName="componentTrash"><FontAwesomeIcon icon={ faTrash } color="#6DB65B" size="larger" /></h3>
            </div>

        </div>
    )

}

export default Memory