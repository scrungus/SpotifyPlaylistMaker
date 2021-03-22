import React, { useContext } from 'react';
import { IonPage, IonButton } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { UserContext } from "../App";
import { get } from '../hooks/useGroupStorage';
import { sendRequest } from '../hooks/requestManager';

interface UserDetailPageProps extends RouteComponentProps<{
  id: string;
}> {}

const Callback: React.FC<UserDetailPageProps> = ({match}) => {
  console.log("Callback");
  const user = useContext(UserContext);

  console.log("id :: " + match.params.id); 
  //will need to check this id, since everything comes through here (e.g. 'groups' page will be read as id=groups)
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

  return (
    <IonPage>
      <h1>SpotifyPlaylistMaker</h1>
      <IonButton>CALLBACK PAGE</IonButton>
    </IonPage>
  );
}

export default Callback;
