import React from "react";
import {
    HashRouter as Router,
    Route,
    Switch,
} from "react-router-dom"
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";

import Navigation from "components/Navigation"
import AddMemory from "./AddMemory";

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
    return (
        <Router>
            {isLoggedIn && <Navigation userObj={ userObj } /> }
            <Switch>
                { isLoggedIn ? (
                    <div>
                        <Route exact path='/'>
                            <Home userObj={ userObj } />
                        </Route>
                        <Route exact path='/profile'>
                            <Profile
                                userObj={ userObj }
                                refreshUser={ refreshUser }
                            />
                        </Route>
                        <Route exact path='/addMemory'>
                            <AddMemory
                                userObj={ userObj }
                            />
                        </Route>
                    </div>
                ) : (
                        <>
                            <Route exact path='/'>
                                <Auth />
                            </Route>
                        </>
                    ) }
            </Switch>
        </Router>
    );
};

export default AppRouter;