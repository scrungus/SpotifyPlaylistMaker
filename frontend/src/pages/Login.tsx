import { useContext } from "react";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonLabel,
  IonButton
} from '@ionic/react';
import { authRequest } from '../hooks/requestManager';
import { get } from '../hooks/useStorage';
import { personCircle } from 'ionicons/icons';

// CSS stuff to centralise the UI.
import './Login.css';

// This lets the login page flag that the user has logged in.
import { UserContext } from "../App";

const Login: React.FC = () => {
  useContext(UserContext);

  const loginClick = () => {
    authRequest();
    const link = get("redirectLink");
    link.then((url) => {
      window.open(url)!;
    });
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
            <IonButton onClick={loginClick}>
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

export default Login;
