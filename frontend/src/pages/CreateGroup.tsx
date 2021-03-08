import { useRef, useState } from 'react';
import { 
  IonHeader,
  IonToolbar,
  IonContent, 
  IonIcon, 
  IonPage, 
  IonLabel,
  IonTitle, 
  IonInput,
  IonFab,
  IonFabButton,
  IonButton,
  IonCard,
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
} from '@ionic/react';
import { add, people, checkmark } from 'ionicons/icons';
import { useGroupStorage } from '../hooks/useGroupStorage';

import './CreateGroup.css';

const CreateGroup: React.FC = () => {
  // Testing purposes, will be redundant once data is pulled from db
  const { saveGroup } = useGroupStorage();

  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<string[]>([]);

  const groupNameRef = useRef<HTMLIonInputElement>(null);
  const membersRef = useRef<HTMLIonInputElement>(null);

  // Local modfications, no commits to Storage
  const newMember = () => {
    const newMember = membersRef.current!.value?.toString()!;
    membersRef.current!.value = "";
    if (newMember === "") {
      alert("Enter a username");
      return;
    }
    const newMembers = [...members, newMember];
    console.log(newMembers);
    setMembers(newMembers);
  }

  const removeMember = (member: string) => {
    const index = members.indexOf(member);
    console.log(index);
    if (index > 1) {
      members.splice(index, 1);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Group</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonFab vertical="top" horizontal="end" slot="fixed" edge>
          <IonFabButton onClick={() => saveGroup(groupName, members)} href="./groups">
            <IonIcon icon={checkmark}/>
          </IonFabButton>
        </IonFab>
        <IonFab vertical="center" horizontal="end" slot="fixed">
          <IonFabButton onClick={newMember}>
            <IonIcon icon={add}/>
          </IonFabButton>
        </IonFab>
        <IonIcon style={{ fontSize: "70px"}} icon={people}/>
        {!groupName && (
          <IonItem>
            <IonInput 
              ref={groupNameRef}
              type="text"
              placeholder="Group Name"
            >
            </IonInput>
            <IonButton onClick={() => setGroupName(groupNameRef.current!.value?.toString()!)}>
              Set name
            </IonButton>
          </IonItem>
        )}
        {groupName && (
          <IonCard className="ion-text-center">
            <h2>{groupName}</h2>

          </IonCard>
        )}
        <IonInput
          ref={membersRef}
          type="text"
          placeholder="Member name"
        >
        </IonInput>
        <IonList>
          {members.map((member: string, index: number) => (
            <IonItemSliding key={index}>
              <IonItem>
                <IonLabel>{member}</IonLabel>
              </IonItem>
          
              <IonItemOptions side="end">
                <IonItemOption color="danger" onClick={() => removeMember(member)}>Remove</IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default CreateGroup;
