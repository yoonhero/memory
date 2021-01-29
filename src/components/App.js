import React, { useState, useEffect } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import styles from "Style.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSpinner,
	faCircleNotch,
	faSync,
	faCog,
	faStroopwafel
} from "@fortawesome/free-solid-svg-icons";


function App() {
	const [init, setInit] = useState(false);
	const [userObj, setUserObj] = useState(null);
	useEffect(() => {
		authService.onAuthStateChanged((user) => {
			if (user) {
				setUserObj({
					displayName: user.displayName,
					uid: user.uid,
					updateProfile: (args) => user.updateProfile(args),
				});
			} else {
				setUserObj(null);
			}
			setInit(true);
		});
	}, []);
	const refreshUser = () => {
		const user = authService.currentUser;
		setUserObj({
			displayName: user.displayName,
			uid: user.uid,
			updateProfile: (args) => user.updateProfile(args),
		});
	};
	return (
		<>
			{init ? (<AppRouter
				refreshUser={ refreshUser }
				isLoggedIn={ Boolean(userObj) }
				userObj={ userObj }
			/>) : (<div className="loadingPage">
				<FontAwesomeIcon icon={ faSpinner } pulse size="3x" className="loadingSpinner" />
				<div className="loadingText">MemoryYourLife</div>
			</div>)
			}
		</>
	);
}
export default App;