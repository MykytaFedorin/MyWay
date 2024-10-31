import Menu from "./Menu.js";
import "./LoginScreen.css";

function LoginScreen({user}){
    let gAuth = process.env.REACT_APP_GOOGLE_AUTH_URL; 
    let clientId = process.env.REACT_APP_CLIENT_ID;
    let redirectUri = process.env.REACT_APP_REDIRECT_URI;

    let fullQuery = gAuth + "?client_id=" + clientId +
                    "&redirect_uri=" + redirectUri+
                    "&response_type=token"+
                    "&scope=openid%20email%20profile";
    return (
        <div id="App-body-wrapper" className={"backgroundEnabled"}>
            <div id="App-body">
                <header id="App-header">
                    <Menu user={user}/>
                </header>
                <div id="loginMessage">
                    <div id="loginMessageWrapper">
                        <h1>
                            <a id="authLink" href={fullQuery}>log in</a>
                        </h1>
                        <h1>
                            to start changing your life
                        </h1>
                    </div> 
                </div>
            </div>
        </div>
    );
}

export default LoginScreen;
