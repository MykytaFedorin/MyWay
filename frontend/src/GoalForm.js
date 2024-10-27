import { useState } from 'react';

function GoalForm(){
    const [currentDate, setCurrentDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0] || ''; 
      });
    const [currentDescription, setCurrentDescription] = useState("");

    function changeDate(event){
        setCurrentDate(event.target.value);        
        console.log(event.target.value);
    }

    function changeDescription(event){
        setCurrentDescription(event.target.value);
    }
    return(
        <form id="goalForm">
            <input id="deadlineInput"
                   onChange={changeDate}
                   type="date"
                   value={currentDate}>
            </input>
            <textarea id="descriptionInput"
                      onChange={changeDescription}
                      placeholder="Goal description"
                      value={currentDescription}>
            </textarea>
        </form>
    );
}
export default GoalForm;
