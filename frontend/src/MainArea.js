import './MainArea.css';
import { useState } from 'react';
import ListItem from './ListItem.js';
import plus from './plus.png';
import GoalForm from './GoalForm.js';

function MainArea({ goals, getAllGoals}) {
    const [currentInfo, setCurrentInfo] = useState(<div></div>);
    const [currentEditArea, setCurrentEditArea] = useState();
    const getGoalUrl = 'http://localhost:8000/user/xfedorin/goal';

    function openDetails(goal_id) { 
        fetch(`${getGoalUrl}/${goal_id}`, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => setCurrentInfo(JSON.stringify(data["description"])))
        .catch(error => console.error('Error fetching goals:', error));
    }
    function deleteGoal(goal_id) { 
        setCurrentInfo("");
        fetch(`${getGoalUrl}/${goal_id}`, {
            method: 'DELETE',
        })
        .then(
            response => {
                if (response.ok) {
                    getAllGoals();
                } else {
                    return response.json().then(err => { throw new Error(err.message); });
                }
            }
        )
        .then(data=>console.log(data))
        .catch(error => console.error('Error fetching goals:', error));
    }
    function createGoalForm(){
        setCurrentInfo(<GoalForm getAllGoals={getAllGoals}
                                 defaultDate=""
                                 defaultDescription=""/>); 
    }
    return (
        <div id="mainArea">
          <div id="goalsListWrapper">
              <div id="goalsListHeader">
                    <span>Goals</span> 
                    <img id="addGoalBtn" 
                         onClick={createGoalForm}
                         src={plus}></img>
              </div>
              <ul id="goalsList">
                {goals.map((goal) => (
                    <ListItem key={goal.goal_id} 
                              onClick={() => openDetails(goal.goal_id)}
                              deleteGoal={() => deleteGoal(goal.goal_id)}
                              goalDescription={goal.description} />
                ))}
              </ul>
          </div>
          <div id="editArea">{currentInfo}</div>
        </div>
    );
}

export default MainArea;

