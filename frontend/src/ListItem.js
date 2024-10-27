import './ListItem.css';
import bucket from './bucket.png';
function ListItem({ onClick, deleteGoal, goalDescription }) {
    return (
        <div className="listItem" onClick={onClick}>
            <li>
                {goalDescription}
            </li>
            <img onClick={deleteGoal}
                 src={bucket} alt="deleteBtn"></img>
        </div>
    );
}

export default ListItem;

