import React, { useEffect, useState } from 'react';
import { 
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonContent, 
  IonTitle, 
  IonItem,
  IonImg,
  IonText,
  IonGrid,
  IonCol,
  IonRow,
  IonButton,
  IonInput,} from '@ionic/react';
import { people } from 'ionicons/icons';
import { get } from '../hooks/useStorage';
import { sendRequestAsync } from '../hooks/requestManager';

interface ContainerProps {
  groupCode: string;
  groupName: string;
}

interface Member {
  id: string;
  username: string;
}

function getGroupMembers(groupCode: number | string): XMLHttpRequest {
  const params = {
    groupCode: groupCode
  }

  return sendRequestAsync("GET", 8002, "getGroupMembers", params, "members");
}

let name = "";

/* async function getGroupPhoto(){
  return people;
}
 */

// Component displayed in modal after group is tapped in Groups tab
const GroupView: React.FC<ContainerProps> = props => {
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
        sendRequest('POST','',{file.name: file},'groupPhoto', 5000);
      };
      reader.readAsDataURL(file);
    };
  }; */
  

  const [members, setMembers] = useState<Member[]>([]);

  const generatePlaylist = () => {
    let toSend: string[] = [];
    members.forEach(member => {
      toSend.push(member.id);
    });



    sendRequestAsync("POST", 8001, "generatePlaylist", { id: toSend, code: props.groupCode, name });
  }

  useEffect(() => {
    let http = getGroupMembers(props.groupCode);
    http.onreadystatechange = e => {
      if(http.readyState != 4){
        return;
      }
      

      let val;
      try{
        val = http.response;
      } catch {
        console.log("couldnt parse");
        return;
      }
      const members = val;
      setMembers(JSON.parse(members)['data']['users']);
     
    }
  }, [props.groupCode])

  return (
    <IonContent color="light">
      <IonItem>
      {/* <input ref={imageUploader} type="file" onChange={(e) => loadImageFromDevice(e)}
          accept="image/*" style={{display: "none"}}>
        </input> */}
        <IonImg /* ref={uploadedImage} */ src={people} /* onClick={() => imageUploader.current.click()} */>
        </IonImg>
      </IonItem>
      <IonItem>
        <IonGrid>
          <IonRow>
          <IonCol>
            <div className='ion-text-left'>
            <IonText> Invite Code : </IonText>
            </div>
          </IonCol>
          <IonCol>
            <div className='ion-text-right'>
            <IonText> {props.groupCode} </IonText>
            </div>
          </IonCol>
          </IonRow>     
        </IonGrid>   
      </IonItem>
      <IonTitle>Members</IonTitle>  
      {members.map((member, index: number) => (
        <IonItemSliding key={index}>
          <IonItem>
            <IonLabel>{member.username}</IonLabel>
          </IonItem>
      
          <IonItemOptions side="end">
            <IonItemOption color="danger" onClick={() => console.log('delete clicked')}>Delete</IonItemOption>
          </IonItemOptions>
      </IonItemSliding>
      ))}
      <IonTitle>Name Playlist</IonTitle>
      <IonItem>
        <IonInput id="namePlaylist" type="text" placeholder="Name Your Playlist" onIonChange={e => {name = e.detail.value || ""}}></IonInput>
        <IonButton onClick={generatePlaylist}>Generate playlist</IonButton>
      </IonItem>
    </IonContent>
  );
};

export default GroupView;
