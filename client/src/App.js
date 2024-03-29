import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import TopPlayers from './display/TopPlayers';
import PlayerStats from "./display/PlayerStats";
import UserLogin from "./auth/UserLogin";
import axios from "axios";
import GameSelection from "./selection/GameSelection";
import AIGame from "./game/ai/AIGame";
import PlayerGame from "./game/player/PlayerGame";
import GuestOption from "./auth/GuestOption";
import UserRegister from "./auth/UserRegister";

/**
 * Main front-end handling file
 * Checks for auto logins with tokens
 * from server API, and has redirects
 * to pages accordingly
 *
 * @constructor
 */
function App() {
    const [loggedIn, setLoggedIn] = useState(false);

	const user = JSON.parse(localStorage.getItem("user"));
    const guestMode = JSON.parse(localStorage.getItem("user")) === 0;
	const authToken = document.cookie.replace(/(?:(?:^|.*;\s*)authToken\s*=\s*([^;]*).*$)|^.*$/, '$1');

	if(!user || !authToken || !guestMode) {
		setLoggedIn(false);
		return;
	}
    useEffect(() => {
        if(guestMode) return
		axios.get('http://localhost:3001/verify-token', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        }).then(() => {
            setLoggedIn((prevLoggedIn) => !prevLoggedIn);
        }).catch((error) => {
            console.error('Token verification failed:', error);
        });

    }, [setLoggedIn]);
    return (
        <Router>
            <Switch>
                <TopPlayers />
                <Route path="/game/:player1/:player2">
				  {loggedIn ? (
					<>
					  <PlayerStats />
					  <PlayerGame />
					</>
				  ) : (
					<Redirect to="/" />
				  )}
				</Route>
				<Route path="/ai-game">
				  {loggedIn ? (
					<>
					  <PlayerStats />
					  <AIGame />
					</>
				  ) : (
					<Redirect to="/" />
				  )}
				</Route>
                <Route path="/" exact>
                    {loggedIn ? (
                        <>
                            <PlayerStats />
                            <GameSelection />
                        </>
                    ) : (
                        <>
                            <UserLogin setLoggedIn={setLoggedIn} />
                            <UserRegister setLoggedIn={setLoggedIn} />
                            <GuestOption />
                        </>
                    )}
                </Route>
			</Switch>
        </Router>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));

export default App;