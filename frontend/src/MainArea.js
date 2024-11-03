import './MainArea.css';
import { useState } from 'react';
import ListItem from './ListItem.js';
import plus from './plus.png';
import GoalForm from './GoalForm.js';
import BurgerButton from './BurgerButton.js';

function MainArea({ goals, getAllGoals, user }) {
    const [currentInfo, setCurrentInfo] = useState(null);
    const [formKey, setFormKey] = useState(0);
    const [activeArea, setActiveArea] = useState("list");

    const getGoalUrl = `${process.env.REACT_APP_BASE_BACKEND_URL}/user/${user}/goal`;

    console.log("user main area =", user);
    console.log("activeArea =", activeArea); // Лог состояния для отладки

    async function openDetails(goal_id) {
        try {
            const response = await fetch(`${getGoalUrl}/${goal_id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch goal details');
            }
            const data = await response.json();
            setFormKey((prevKey) => prevKey + 1);
            setCurrentInfo(
                <GoalForm
                    key={formKey}
                    getAllGoals={getAllGoals}
                    data={data}
                    isNew={false}
                    user={user}
                />
            );
            setActiveArea("edit");  // Переключаем на "edit"
        } catch (error) {
            console.error('Error fetching goal details:', error);
        }
    }
    let toggleActiveArea = () => {
        setActiveArea(prevArea => (prevArea === "edit" ? "list" : "edit"));
        console.log("hello");
    };
    async function deleteGoal(goal_id) {
        try {
            const response = await fetch(`${getGoalUrl}/${goal_id}`, { method: 'DELETE' });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            getAllGoals();
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    }

    function createGoalForm() {
        setFormKey((prevKey) => prevKey + 1);
        setCurrentInfo(
            <GoalForm
                key={formKey}
                getAllGoals={getAllGoals}
                data={{ deadline: "", description: "" }}
                isNew={true}
                user={user}
            />
        );
        setActiveArea("edit"); // Переключаем на "edit"
    }

    return (
        <div id="mainArea">
            <BurgerButton onClick={toggleActiveArea} />
            <div id="goalsListWrapper" className={activeArea === "list" ? "activeArea" : "hidden"}>
                <div id="goalsListHeader">
                    <span>Goals</span>
                    <img
                        id="addGoalBtn"
                        onClick={createGoalForm}
                        src={plus}
                        alt="Add Goal"
                    />
                </div>
                <ul id="goalsList">
                    {goals.map((goal) => (
                        <ListItem
                            key={goal.goal_id}
                            onClick={() => openDetails(goal.goal_id)}
                            deleteGoal={() => deleteGoal(goal.goal_id)}
                            goalDescription={goal.description}
                        />
                    ))}
                </ul>
            </div>
            <div id="editArea" className={activeArea === "edit" ? "activeArea" : "hidden"}>
                {currentInfo}
            </div>
        </div>
    );
}

export default MainArea;

