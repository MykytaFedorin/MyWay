import './ListItem.css';
import bucket from './bucket.png';
function ListItem({ onClick, deleteGoal, goalDescription }) {
    return (
        <div className="listItem">
            <li onClick={onClick} >
                {goalDescription}
            </li>
            <img onClick={deleteGoal}
                 src={bucket} alt="deleteBtn"></img>
        </div>
    );
}

export default ListItem;

