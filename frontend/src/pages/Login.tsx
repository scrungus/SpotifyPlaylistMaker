import { useContext } from "react";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import {
  IonContent,
  IonPage,
  IonIcon,
  IonLabel,
  IonButton} 
from '@ionic/react';
import { sendGetRequest } from '../hooks/spotifyAPI';
import { get } from '../hooks/useGroupStorage';
import { personCircle } from 'ionicons/icons';

// CSS stuff to centralise the UI.
import './Login.css';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

// /* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

// This lets the login page flag that the user has logged in.
import { UserContext } from "../App";

/* Theme variables */
import '../theme/variables.css';

const Login: any = () => {
  /* This part allows the user to log in if they use a valid username
     and password. We want probably want to make the request to the
     auth service from here. */

  //const [userName, setUserName] = useState<string>("");
  //const [password, setPassword] = useState<string>("");
  const user = useContext(UserContext);

  const redirect = async (url: string) => {
    /*
    Opens new tab with Spotify login. You need to have the
    uvicorn server from the auth directory running locally.

    '_blank' parameter should open browser in-app on mobile.
    */
    const browser = InAppBrowser.create(url, '_blank');
    // Should be getting page HTML
    browser.executeScript({
      code: "document.getElementsByTagName('pre')[0].innerHTML"
    }).then((value) => console.log(value));
  }

  const loginClick = () => {
    //setBusy(true);
    
    //if (userName === "a" && password === "a") {
    // user.setIsLoggedIn(true);
    //} else {
    //}
    //setBusy(false);

    sendGetRequest();
    const link = get("redirectLink");
    link.then((value) => redirect(value));
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="fullheight xc">
          <div className="vcs">
            <h1>SpotifyPlaylistMaker</h1>
            <IonIcon icon={personCircle}
              style={{ fontSize: "70px", color: "#0040ff" }} />
            <br></br><br></br><br></br>
            <IonButton onClick={loginClick} >
              <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
                width="25" alt="Spotify Logo"/>
              <IonLabel>Use Spotify</IonLabel>
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

/* I'm keeping this here in case we decide to use it in the future.
<IonItem>
  <IonLabel position="floating">Email</IonLabel>
  <IonInput type="email"></IonInput>
</IonItem> */

export default Login;
