import { useState } from 'react';
import {
  IonContent,
  IonTitle,
  IonItem,
  IonImg,
  IonList,
  IonButton,
  IonInput,
  IonThumbnail,
  IonCard,
  IonText,
} from '@ionic/react';
import { people } from 'ionicons/icons';
import { get } from '../hooks/useStorage';
import { sendRequestAsync } from '../hooks/requestManager';



// Component displayed in modal after group is tapped in Groups tab
const GroupJoiner: React.FC = props => {
  const [code, setCode] = useState<string>("");

  const [joinedGroup, setJoined] = useState<number>(0);

  const joinGroup = (groupCode: string) => {
    const userID = JSON.parse(document.cookie.split('; ')[0].slice(5)).spotify_id;
    const params = { groupCode: groupCode, spotifyID: userID };
    let http = sendRequestAsync("POST", 8002, "addGroupMember", params, "addmember");
    http.onreadystatechange = e => {
      if(http.readyState != 4){
        return;
      }
  
      try{
        let res = JSON.parse(http.response);
        if(res.success){
          setJoined(2);
        } else {
          setJoined(1);
        }
      }catch{
        setJoined(1)
      }
    }
  }
  

  return (
    <IonContent color="light">
      <IonCard>
        <IonItem>
          <IonTitle>Join Group</IonTitle>
          <IonThumbnail slot="start">
            <IonImg src={people}></IonImg>
          </IonThumbnail>
        </IonItem>
        <IonList>
          <IonItem>
            <IonInput id="joinGrp" type="text" placeholder="Enter an Invite Code" onIonChange={e => setCode(e.detail.value!)} ></IonInput>
            <IonButton onClick={() => joinGroup(code)}>Join Group</IonButton>
          </IonItem>
          {(joinedGroup == 2) ?
            (
              <IonItem>
                <IonText color="success">
                  Group Joined!
                </IonText>
              </IonItem>)
            : (joinedGroup == 1) ? (
              <IonItem>
                <IonText color="danger">
                  Failed to join group
                </IonText>
              </IonItem>)
              : null
          }
        </IonList>
      </IonCard>
    </IonContent>
  );
};

export default GroupJoiner;
