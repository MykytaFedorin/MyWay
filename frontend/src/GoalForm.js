import { useState, useEffect } from 'react';
import './GoalForm.css';

function GoalForm({ getAllGoals, data, isNew, user}) {
    const [currentDate, setCurrentDate] = useState(data.deadline);
    const [currentDescription, setCurrentDescription] = useState(data.description);
    const [saveTimeout, setSaveTimeout] = useState(null);
    const btnName = isNew ? "Create" : "Save";

    function changeDate(event) {
        setCurrentDate(event.target.value);
    }

    function changeDescription(event) {
        setCurrentDescription(event.target.value);
    }

    function createGoal() {
        const url = process.env.REACT_APP_BASE_BACKEND_URL +"/user/"+ user +"/goals";
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                description: currentDescription,
                deadline: currentDate,
                owner_login: ""+ user +""
            }),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => {
            console.log("Goal created:", data);
            getAllGoals(); // Обновляем список целей
            setCurrentDate("");
            setCurrentDescription("");
        })
        .catch(error => console.error('Error creating goal:', error));
    }

    function editGoal() {
        const url = process.env.REACT_APP_BASE_BACKEND_URL + "/user/" + user + "/goal/" + data.goal_id;
        return fetch(url, {
            method: 'PUT',
            body: JSON.stringify({
                description: currentDescription,
                deadline: currentDate,
                owner_login: ""+ user +""
            }),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => {
            console.log("Goal updated:", data);
            getAllGoals(); // Обновляем список целей
        })
        .catch(error => console.error('Error updating goal:', error));
    }

    // Функция автосохранения
    function autoSaveGoal() {
        if (isNew) {
            createGoal();
        } else {
            editGoal();
        }
    }

    // Хук useEffect для отслеживания изменений и автосохранения
    useEffect(() => {
        // Сбрасываем предыдущий таймер
        if (saveTimeout) {
            clearTimeout(saveTimeout);
        }

        // Устанавливаем новый таймер на 2 секунды
        const newTimeout = setTimeout(() => {
            autoSaveGoal();
        }, 2000); // автосохранение через 2 секунды

        // Сохраняем таймер в состоянии
        setSaveTimeout(newTimeout);

        // Очищаем таймер при размонтировании компонента
        return () => clearTimeout(newTimeout);
    }, [currentDate, currentDescription]); // следим за изменениями этих полей

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
                    onClick={(e) => {
                        e.preventDefault();
                        isNew ? createGoal() : editGoal();
                    }}
                >
                    {btnName}
                </button>
            </div>
        </form>
    );
}

export default GoalForm;

