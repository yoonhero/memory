import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import { Link } from "react-router-dom";
import Memory from "components/Memory";
import styles from "Style.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const Home = ({ userObj }) => {
    const [search, setSearch] = useState(false);
    const [searchKeyWord, setSearchKey] = useState("");
    const [memories, setMemories] = useState([]);
    const [memory, setMemory] = useState([]);
    const [mobileSearch, setMobileSearch] = useState(false);

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
    const onChange = async (event) => {
        const {
            target: { name, value },
        } = event;
        setSearchKey(value);
        setSearch(true)
        var memoryArray = []
        const filterMemory = await memories.filter((memory) => {
            if (memory.title.toLowerCase().includes(value)) {
                memoryArray.push(memory)
            } else if (memory.def.toLowerCase().includes(value)) {
                memoryArray.push(memory)
            }
        });
        setMemory(memoryArray)
    };
    const onMobileSearch = () => {
        if (mobileSearch) {
            setMobileSearch(false)
            document.querySelector(".searchBar").classList.remove("mobile")
        } else {
            setMobileSearch(true)
            document.querySelector(".searchBar").classList.add("mobile")
        }
    }
    return (
        <div className="main">
            <input className="searchBar mobile" type="search" placeholder="Search..." onChange={ onChange } value={ searchKeyWord } />
            <button className="isMobile" onClick={ onMobileSearch }><FontAwesomeIcon icon={ faSearch }></FontAwesomeIcon></button>
            <div className="container">
                { search === true ? (memory.map((memory) => (
                    < Memory
                        key={ memory.id }
                        userObj={ userObj }
                        memoryObj={ memory }
                    />
                ))
                ) : (memories.map((memory) => (
                    <Memory
                        key={ memory.id }
                        userObj={ userObj }
                        memoryObj={ memory }
                    />
                ))) }



            </div>

            <button className="plus" ><Link to="/addMemory" className="plusText">
                +
            </Link></button>
        </div>
    )
}
export default Home;