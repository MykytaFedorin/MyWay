import './ListItem.css';
import bucket from './bucket.png';

function ListItem({ onClick, deleteGoal, goalDescription }) {
    // Обрезаем строку до первых двух слов
    const shortDescription = goalDescription.split(" ").slice(0, 2).join(" ");
    
    return (
        <div className="listItem" onClick={onClick}>
            <li>
                {shortDescription}
            </li>
            <img onClick={deleteGoal}
                 src={bucket} alt="deleteBtn"></img>
        </div>
    );
}

export default ListItem;

