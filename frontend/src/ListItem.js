import './ListItem.css';

function ListItem({ onClick, goalDescription }) {
    return (
        <li onClick={onClick} className="listItem">
            {goalDescription}
        </li>
    );
}

export default ListItem;

