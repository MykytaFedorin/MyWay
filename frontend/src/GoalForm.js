function GoalForm(){
    return(
        <form id="goalForm">
            <input id="deadlineInput"
                   type="date"></input>
            <textarea id="descriptionInput"
                   placeholder="Goal description"></textarea>
        </form>
    );
}
export default GoalForm;
