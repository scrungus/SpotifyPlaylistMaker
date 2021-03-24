import { 
  IonButton,
  IonContent, 
  IonHeader, 
  IonItem, 
  IonList, 
  IonPage, 
  IonTitle, 
  IonToolbar} from '@ionic/react';
import React, { useState } from 'react';
import { sendRequestAsync } from '../hooks/requestManager';
import './Settings.css';

const Settings: React.FC = () => {
  const [deleted, setDeleted] = useState<boolean>(false);
  const currUser = JSON.parse(document.cookie.split('; ')[0].slice(5))

  const deleteAccount = () =>{
    let http = sendRequestAsync("POST", 8002, "deleteAccount", { spotifyID: currUser.spotify_id }, "");


    http.onreadystatechange = e =>{
      if(http.readyState != 4){
        return;
      }
      //window.location.href = "/";
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItem>
            <IonButton color="danger" onClick={deleteAccount}>
              Delete Account
            </IonButton>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
