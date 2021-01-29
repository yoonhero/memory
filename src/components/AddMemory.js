import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { storageService, dbService } from "fbase";
import { useHistory } from "react-router-dom"
import styles from "AddMemory.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
const AddMemory = ({ userObj }) => {
    const history = useHistory();
    const [memoryTitle, setMemoryTitle] = useState("");
    const [memoryDef, setMemoryDef] = useState("")
    const [attachment, setAttachment] = useState("");
    const onSubmit = async (event) => {
        if (memoryTitle === "" || memoryDef === "") {
            return;
        }
        event.preventDefault();
        let attachmentUrl = "";
        if (attachment !== "") {
            const attachmentRef = storageService
                .ref()
                .child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(
                attachment,
                "data_url"
            );
            attachmentUrl = await response.ref.getDownloadURL();
        }
        else {
            return;
        }
        var today = new Date(),

            date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
        const memoryObj = {
            title: memoryTitle,
            def: memoryDef,
            createdAt: Date.now(),
            liked: false,
            date: date,
            creatorId: userObj.uid,
            attachmentUrl,
        };
        await dbService.collection(userObj.uid).add(memoryObj);
        setMemoryTitle("");
        setMemoryDef("")
        setAttachment("");
        history.push("/")
    };
    const onChange = (event) => {
        const {
            target: { name, value },
        } = event;
        if (name === "title") {
            setMemoryTitle(value);
        } else if (name === "definition") {
            setMemoryDef(value);
        }


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
        <div className="form">
            <form onSubmit={ onSubmit } className="factoryForm" >
                <div className="memoryFormDiv">
                    <input
                        className=""
                        value={ memoryTitle }
                        onChange={ onChange }
                        type="text"
                        placeholder="제목"
                        maxLength={ 50 }
                        name="title"
                        className="memoryTitleInput"
                    />
                    <textarea
                        className=""
                        value={ memoryDef }
                        onChange={ onChange }
                        type="text"
                        placeholder="오늘의 일을 되돌아보며"
                        maxLength={ 300 }
                        name="definition"
                        className="memoryDefInput"
                    />

                </div>
                <label for="attach-file" className="factoryInput__label">
                    <span>사진 추가</span>
                    <FontAwesomeIcon icon={ faPlus } />
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
                { attachment && (
                    <div className="factoryForm__attachment">
                        <img
                            src={ attachment }
                            style={ {
                                backgroundImage: attachment,
                                width: 200,
                            } }
                        />
                        <div className="factoryForm__clear" onClick={ onClearAttachment }>
                            <FontAwesomeIcon icon={ faTimes } />
                        </div>
                    </div>
                ) }
                <input type="submit" value="기억저장" className="saveMemoryBtn" />
            </form>
        </div>
    )
}

export default AddMemory;