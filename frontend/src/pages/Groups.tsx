import React, { useState, useEffect } from 'react';
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
  IonButtons,
} from '@ionic/react';
import './Groups.css';
import GroupContainer from '../components/GroupContainer';
import GroupView from '../components/GroupView';
import { add, close } from 'ionicons/icons';
import { get } from '../hooks/useStorage';
import { sendRequestAsync } from '../hooks/requestManager';

interface Group {
  group_code: string;
  group_name: string;
}

function getUsersGroups(userId: number | string): XMLHttpRequest {
  const params = {
    spotifyID: userId
  }

  return sendRequestAsync("GET", 8002, "getUsersGroupsBySpotifyID", params, "groups");
}

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState({ group_code: "", group_name: "" });


  const getModal = (group: Group) => {
    setSelectedGroup(group);
    setShowModal(true);
  }

  useEffect(() => {
    const currUserID = JSON.parse(document.cookie.split('; ')[0].slice(5)).spotify_id;
    let http = getUsersGroups(currUserID);

    http.onreadystatechange = (e) => {
      if (http.readyState != 4) {
        return;
      }

      let groups;
      try {
        groups = http.response;
      } catch {
        console.log("couldnt parse");
        return;
      }
      if (groups !== null && JSON.parse(groups)['success']) {
        console.log("returning groups");
        setGroups(JSON.parse(groups)['data']);
      }

    }
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
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
          <GroupView groupCode={selectedGroup.group_code} groupName={selectedGroup.group_name} />
        </IonModal>
        <IonFab vertical="top" horizontal="end" slot="fixed" edge>
          <IonFabButton href="./create_group">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <IonList>
          {groups.map((group, index: number) => (
            <IonItem key={index} onClick={() => getModal(group)}>
              <GroupContainer groupName={group.group_name} />
            </IonItem>
          ))}
          {/*  <IonItem>
            <IonInput value={code} placeholder="Group code"
              onIonChange={e => setCode(e.detail.value!)}></IonInput>
            <IonButton onClick={() => joinGroup(code)}>Join group with code</IonButton>
          </IonItem> */}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Groups;
