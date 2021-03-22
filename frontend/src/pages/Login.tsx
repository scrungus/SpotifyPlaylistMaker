import { useContext } from "react";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonLabel,
  IonButton
} from '@ionic/react';
import { authRequest, sendRequest } from '../hooks/requestManager';
import { get } from '../hooks/useGroupStorage';
import { personCircle } from 'ionicons/icons';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { RouteComponentProps } from 'react-router-dom';

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
import { exception } from "node:console";
import { parse } from "node:url";

interface UserDetailPageProps extends RouteComponentProps<{
  id: string;
}> {}

const Login: React.FC<UserDetailPageProps> = ({match}) => {
  console.log("id :: "+match.params.id); //will need to check this id, since everything comes through here (e.g. 'groups' page will be read as id=groups)
  /* This part allows the user to log in if they use a valid username
     and password. We want probably want to make the request to the
     auth service from here. */

  if (match.params.id !== undefined){
    sendRequest("GET", "getUserBySpotifyID", { spotifyID: match.params.id }, "currentUser");
  
    const cUserPromise = get("currentUser");
    cUserPromise.then((val) =>{
    try{
      console.log("val: ",val);
      val = JSON.parse(val);
      if(!val.success){
        console.log("user doesnt exist");
      }else{
        document.cookie = JSON.stringify(val.data);
      }
    }
    catch(e){
      console.error(e);
      console.log("invalid user data");
    } 
    });
  }

  if(document.cookie){
    const cUserPromise = get("currentUser");
    cUserPromise.then((val) =>{
      if(val && val['spotifyID'] === JSON.parse(document.cookie).spotify_id){
        user.setIsLoggedIn(true);
      }
    }); 
  }
  


  //const [userName, setUserName] = useState<string>("");
  //const [password, setPassword] = useState<string>("");
  const user = useContext(UserContext);


  const loginClick = () => {
    authRequest();
    const link = get("redirectLink");
    link.then((url) => {
      const redirectWindow = window.open(url)!;
      // Best I could do, only works after authentication
      redirectWindow.addEventListener('pageshow', (e) => {
        if (e) {
          //redirectWindow.close();
          //user.setIsLoggedIn(true);
        }
      });
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
