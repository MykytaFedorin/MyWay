import { useState } from 'react';
import './GoalForm.css';

function GoalForm({ getAllGoals, data, isNew, user}) {
    const [currentDate, setCurrentDate] = useState(data.deadline);
    const [currentDescription, setCurrentDescription] = useState(data.description);
    console.log("user="+user);
    const btnName = isNew ? "Create" : "Save";

    function changeDate(event) {
        setCurrentDate(event.target.value);
        console.log(event.target.value);
    }

    function changeDescription(event) {
        setCurrentDescription(event.target.value);
    }

    function createGoal(event) {
        event.preventDefault(); // Предотвращаем перезагрузку страницы
        console.log("user path="+user);
        const url = process.env.REACT_APP_BASE_BACKEND_URL +"/user/"+ user +"/goals";
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                description: currentDescription,
                deadline: currentDate,
                owner_login: ""+ user +""
            }),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => {
                response.json();
                getAllGoals(); // Вызываем функцию обновления целей
                setCurrentDate("");
                setCurrentDescription("");
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => console.error('Error creating goal:', error));
    }
    function editGoal(event) {
        event.preventDefault(); // Предотвращаем перезагрузку страницы
        console.log(data.goal_id);
        const url = process.env.REACT_APP_BASE_BACKEND_URL+ "/"+user +"/goal" + "/" + data.goal_id;
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify({
                description: currentDescription,
                deadline: currentDate,
                owner_login: ""+ user +""
            }),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => {
                response.json();
                getAllGoals(); // Вызываем функцию обновления целей
                setCurrentDate("");
                setCurrentDescription("");
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => console.error('Error creating goal:', error));
    }
    return (
        <form id="goalForm">
            <input
                id="deadlineInput"
                onChange={changeDate}
                type="date"
                value={currentDate}
            />
            <textarea
                id="descriptionInput"
                onChange={changeDescription}
                placeholder="Goal description"
                value={currentDescription}
            />
            <div id="createBtnWrapper">
                <button
                    id="createBtn"
                    onClick={isNew ? createGoal : editGoal}
                >
                {btnName}
                </button>
            </div>
        </form>
    );
}

export default GoalForm;

