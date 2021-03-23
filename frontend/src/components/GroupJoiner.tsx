import { useEffect, useState, useRef } from 'react';
import { 
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonContent, 
  IonTitle, 
  IonItem,
  IonImg,
  IonList,
  IonButton,
  IonInput,
  IonThumbnail,
  IonCard,} from '@ionic/react';
import { people } from 'ionicons/icons';
import { get } from '../hooks/useGroupStorage';
import { fileRequest, sendRequest } from '../hooks/requestManager';

interface ContainerProps {
  groupCode: string;
  groupName: string;
}

interface Member {
  id: number;
  username: string;
}

const joinGroup = (groupCode: string) => {
  const userID = JSON.parse(document.cookie.split('; ')[0].slice(5)).spotify_id;
  const params = { groupCode: groupCode, spotifyID: userID };
  sendRequest("POST", "addGroupMember", params, "addmember");
}

 // Component displayed in modal after group is tapped in Groups tab
const GroupJoiner: React.FC = props => {
  const [code, setCode] = useState<string>("");
  /* const uploadedImage = useRef<typeof IonImg>(null);
  const imageUploader = useRef<HTMLInputElement>(null); */

  /*
  function loadImageFromDevice(e) {
  
    const file = e.target.files[0];
  
    if (file) {
      const reader = new FileReader();
      const { current } = uploadedImage;
      current.file = file;
      reader.onload = e => {
        current.src = e.target.result;
        fileRequest('POST','',`{${file.name}: ${file}}`,'groupPhoto');
      };
      reader.readAsDataURL(file);
    };
  }; */
  

  /* const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const members_promise = getGroupMembers(props.groupCode);
    members_promise.then((values) => {
      setMembers(values);
    });
  }, [props.groupCode]) */

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
            </IonList>
        </IonCard>
    </IonContent>
  );
};

export default GroupJoiner;
