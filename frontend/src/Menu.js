import './Menu.css';
import avatar from "./avatar.png";

function Menu(){
return (<nav>
      <ul id="menu">
        <li><a href="#philosofy">Philosofy</a></li>
        <li><a href="#goals">Goals</a></li>
      </ul>
       <div id="profile">
            <img id="avatarImg" src={avatar} alt="avatar"/>
            <ul id="profileMenu">
                <li id="settingsBtn"></li>
            </ul>
        </div>
    </nav>)
}

export default Menu;
