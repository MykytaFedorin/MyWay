import './MainArea.css';
import { useState } from 'react';
import ListItem from './ListItem.js';

function MainArea({ goals }) {
    const [currentInfo, setCurrentInfo] = useState("");
    const getGoalUrl = 'http://localhost:8000/user/xfedorin/goal';

    function openDetails(goal_id) { 
        fetch(`${getGoalUrl}/${goal_id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => setCurrentInfo(JSON.stringify(data["description"])))
        .catch(error => console.error('Error fetching goals:', error));
    }

    return (
        <div id="mainArea">
          <ul id="goalsList">
            {goals.map((goal) => (
                <ListItem key={goal.goal_id} 
                          onClick={() => openDetails(goal.goal_id)}
                          goalDescription={goal.description} />
            ))}
          </ul>
          <div id="editArea">{currentInfo}</div>
        </div>
    );
}

export default MainArea;

