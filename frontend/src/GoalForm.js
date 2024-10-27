import { useState } from 'react';
import './GoalForm.css';

function GoalForm({ getAllGoals }) {
    const [currentDate, setCurrentDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0] || ''; 
    });
    const [currentDescription, setCurrentDescription] = useState("");

    function changeDate(event) {
        setCurrentDate(event.target.value);
        console.log(event.target.value);
    }

    function changeDescription(event) {
        setCurrentDescription(event.target.value);
    }

    function createGoal(event) {
        event.preventDefault(); // Предотвращаем перезагрузку страницы
        const url = "http://localhost:8000/user/xfedorin/goals";
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                description: currentDescription,
                deadline: currentDate,
                owner_login: "xfedorin"
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
                    onClick={createGoal}
                >
                    Create
                </button>
            </div>
        </form>
    );
}

export default GoalForm;

