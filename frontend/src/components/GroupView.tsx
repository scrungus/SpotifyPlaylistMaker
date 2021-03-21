import { useEffect, useState, useRef } from 'react';
import { 
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonContent, 
  IonTitle, 
  IonItem,
  IonImg,} from '@ionic/react';
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

async function getGroupMembers(groupCode: number | string): Promise<Member[]> {
  const params = {
    groupCode: groupCode
  }

  sendRequest("GET", "getGroupMembers", params, "members");
  const members = await get("members");
  return JSON.parse(members)['data']['users'];
}

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
        fileRequest('POST','',`{${file.name}: ${file}}`,'groupPhoto');
      };
      reader.readAsDataURL(file);
    };
  }; */
  

  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const members_promise = getGroupMembers(props.groupCode);
    members_promise.then((values) => {
      setMembers(values);
    });
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
    </IonContent>
  );
};

export default GroupView;
