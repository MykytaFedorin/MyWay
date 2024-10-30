import React, { useState, useEffect } from 'react';
import './App.css';
import Menu from './Menu.js';
import MainArea from './MainArea.js';

function App() {
    const [user, setUser] = useState("guest");
    const [token, setToken] = useState("");
    const [goals, setGoals] = useState([]);
    const url_ = 'http://localhost:8000/user/xfedorin/goals';

    useEffect(() => {
        identifyUser(); // Вызываем только один раз при монтировании компонента
        getAllGoals();
    }, []); 

    async function identifyUser() {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        
        if (accessToken) {
            console.log("Access Token:", accessToken);
            setToken(accessToken);
            setUser("loggedin");
            window.location.hash = '';

            // Получите информацию о пользователе сразу после получения токена
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
                    'Authorization': `Bearer ${accessToken}`, // Используем переданный токен
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const userInfo = await response.json();
            const userName = userInfo.name; 
            setUser(userName); // Установите имя пользователя
            console.log('User Name:', userName); // Выводим имя пользователя для отладки
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    }

    async function getAllGoals() {
        try {
            const response = await fetch(url_, {
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

    return (
        <div id="App-body">
            <header id="App-header">
                <Menu user={user}/>
            </header>
            <MainArea goals={goals} getAllGoals={getAllGoals}/>
        </div>
    );
}

export default App;

