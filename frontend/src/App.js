import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Menu from './Menu.js';
import MainArea from './MainArea.js';

function App() {
    const [goals, setGoals] = useState([]);
    const url_ = 'http://localhost:8000/user/xfedorin/goals';
    const getGoalUrl = 'http://localhost:8000/user/xfedorin/goals';
    
    useEffect(() => {
        getAllGoals();
    }, []); 

    function getAllGoals() {
        fetch(url_, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => setGoals(data))
        .catch(error => console.error('Error fetching goals:', error));
    }
    return (
        <div id="App-body">
            <header id="App-header">
                <Menu />
            </header>
            <MainArea goals={goals}/>
        </div>
    );
}

export default App;

