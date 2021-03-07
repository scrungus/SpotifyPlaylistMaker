import { useState } from 'react';
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
import { add, close } from 'ionicons/icons';
import GroupContainer from '../components/GroupContainer';

import './Groups.scss';
import GroupView from '../components/GroupView';

const Groups: React.FC = () => {
  const groups = ["Test Group 1", "Test Group 2"];

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const getModal = (groupName: string) => {
    setModalTitle(groupName);
    setShowModal(true);
  }

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
            <IonTitle>{modalTitle}</IonTitle>
            <IonButtons slot="secondary">
              <IonButton onClick={() => setShowModal(false)}>
                <IonIcon icon={close}/>
              </IonButton>
            </IonButtons>
          </IonToolbar>
          <GroupView groupName={modalTitle}/>
        </IonModal>
        <IonFab vertical="top" horizontal="end" slot="fixed" edge>
          <IonFabButton href="./create_group">
            <IonIcon icon={add}/>
          </IonFabButton>
        </IonFab>
        <IonList>
          {groups.map((group: string, index: number) => (
            <IonItem key={index} onClick={() => getModal(group)}>
              <GroupContainer groupName={group}/>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Groups;
