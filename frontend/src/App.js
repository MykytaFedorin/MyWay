import React, { useState, useEffect } from 'react';
import './App.css';
import Menu from './Menu.js';
import MainArea from './MainArea.js';
import LoginScreen from "./LoginScreen.js";

function App() {
    const [user, setUser] = useState("guest");
    const [token, setToken] = useState(localStorage.getItem('accessToken') || "");
    const [goals, setGoals] = useState([]);
    const [backgroundStatus, setBackgroundStatus] = useState(true);
    const [activeArea, setActiveArea] = useState("list");
    console.log("user="+user);
    const baseUrl = process.env.REACT_APP_BASE_BACKEND_URL;
    let toggleBackground = () => {
        setBackgroundStatus(!backgroundStatus);
    }

    useEffect(() => {
        if (token) {
            fetchUserInfo(token);
        } else {
            identifyUser();
        }
    }, [token]);

    async function identifyUser() {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        
        if (accessToken) {
            console.log("Access Token:", accessToken);
            setToken(accessToken);
            localStorage.setItem('accessToken', accessToken);
            window.location.hash = '';
            await fetchUserInfo(accessToken);
        } else {
            console.log("Токен не найден в URL.");
        }
    }

    async function fetchUserInfo(accessToken) {
        try {
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const userInfo = await response.json();
            const userEmail = userInfo.email; 
            setUser(userEmail);
            localStorage.setItem("email", userEmail);

            toggleBackground();
            getAllGoals(userEmail);
        } catch (error) {
            console.error('Error fetching user info:', error);
            localStorage.removeItem("accessToken");
        }
    }

    async function logoutUser(){
        setUser("guest"); 
        localStorage.removeItem("accessToken");
    }

    async function getAllGoals(user) {
        console.log("get user = " + user);
        const url = baseUrl + "/user/"+user+"/goals";
        console.log("url"+url);
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setGoals(data);
        } catch (error) {
            console.error('Error fetching goals:', error);
        }
    }

    if (user !== "guest") {
        return (
            <div id="App-body">
                <header id="App-header">
                    <Menu user={user} logout={logoutUser}/>
                </header>
                <MainArea goals={goals} getAllGoals={() => getAllGoals(user)} user={user}/>
            </div>
        );
    } else {
        return(<LoginScreen user={user}/>);
    }
}

export default App;

