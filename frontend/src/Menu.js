import './Menu.css';
import avatar from "./avatar.png";

function Menu({user}){
    let gAuth = process.env.REACT_APP_GOOGLE_AUTH_URL; 
    let clientId = process.env.REACT_APP_CLIENT_ID;
    let redirectUri = process.env.REACT_APP_REDIRECT_URI;

    let fullQuery = gAuth + "?client_id=" + clientId +
                    "&redirect_uri=" + redirectUri+
                    "&response_type=token"+
                    "&scope=openid%20email%20profile";
return (<nav>
      <ul id="menu">
        <li><a href="#philosofy">Philosofy</a></li>
        <li><a href="#goals">Goals</a></li>
      </ul>
        <a href={fullQuery}>Google</a>
        <span>{user}</span>
       <div id="profile">
            <img id="avatarImg" src={avatar} alt="avatar"/>
            <ul id="profileMenu">
                <li id="settingsBtn"></li>
            </ul>
        </div>
    </nav>);
}

export default Menu;
