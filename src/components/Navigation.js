import React, { useEffect, useState } from 'react';
import { dbService } from "fbase";
import { Link } from "react-router-dom";
import Memory from "components/Memory";
import styles from "Navigation.css"

import { faUser } from "@fortawesome/free-solid-svg-icons"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const Navigation = ({ userObj }) => {

    return (
        <>
            <Link to="/" className="navTitle">Memory</Link>
            <nav>

                <button>
                    <Link to="/profile">
                        <span className="navProfile">
                            <FontAwesomeIcon icon={ faUser } size="2x" />
                        </span>
                    </Link></button>

            </nav>
        </>
    );
}


export default Navigation;