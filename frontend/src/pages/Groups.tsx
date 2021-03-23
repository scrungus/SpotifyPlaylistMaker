import { useState, useEffect } from 'react';
import { 
  IonHeader,
  IonToolbar,
  IonContent, 
  IonIcon, 
  IonPage, 
  IonFab,
  IonTitle, 
  IonList,
  IonItem,
  IonFabButton,
  IonModal,
  IonButton,
  IonButtons
} from '@ionic/react';
import './Groups.css';
import GroupContainer from '../components/GroupContainer';
import GroupView from '../components/GroupView';
import { add, close } from 'ionicons/icons';
import { get } from '../hooks/useStorage';
import { sendRequest } from '../hooks/requestManager';

interface Group {
  group_code: string;
  group_name: string;
}

async function getUsersGroups(userId: number | string): Promise<Group[]> {
  const params = {
    spotifyID: userId
  }

  sendRequest("GET", 8002, "getUsersGroupsBySpotifyID", params, "groups");
  const groups = get("groups");
  groups.then((val) => {
    if(val !== null && val['success']){
      return JSON.parse(val)['data'];
    }
  })
  return [];
}

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState({group_code: "", group_name: ""});

  const getModal = (group: Group) => {
    setSelectedGroup(group);
    setShowModal(true);
  }

  useEffect(() => {
    const currUserID = JSON.parse(document.cookie.split('; ')[0].slice(5)).spotify_id;
    const groups_promise = getUsersGroups(currUserID);
    groups_promise.then((values) => {
      if (values !== null) { 
        setGroups(values);
      }
    });
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Groups</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonModal isOpen={showModal} swipeToClose={true}>
          <IonToolbar>
            <IonTitle>{selectedGroup.group_name}</IonTitle>
            <IonButtons slot="secondary">
              <IonButton onClick={() => setShowModal(false)}>
                <IonIcon icon={close}/>
              </IonButton>
            </IonButtons>
          </IonToolbar>
          <GroupView groupCode={selectedGroup.group_code} groupName={selectedGroup.group_name}/>
        </IonModal>
        <IonFab vertical="top" horizontal="end" slot="fixed" edge>
          <IonFabButton href="./create_group">
            <IonIcon icon={add}/>
          </IonFabButton>
        </IonFab>
        <IonList>
          {groups.map((group, index: number) => (
            <IonItem key={index} onClick={() => getModal(group)}>
              <GroupContainer groupName={group.group_name}/>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Groups;
