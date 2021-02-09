import React, { useState, useEffect } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import styles from "Style.css"

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
				<div className="loadingText1">Memory</div>
				<div className="loadingText2">기억</div>
			</div>)
			}
		</>
	);
}
export default App;