import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import GroupCreator from '../components/GroupCreator'
import './CreateGroup.css';

const CreateGroup: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Create Group</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen>
      <GroupCreator />
    </IonContent>
  </IonPage>
);

export default CreateGroup;
