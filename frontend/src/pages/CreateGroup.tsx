import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import GroupCreator from '../components/GroupCreator'
import GroupJoiner from '../components/GroupJoiner'
import './CreateGroup.css';

const CreateGroup: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Create or Join a Group</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen>
      <GroupCreator />
      <GroupJoiner />
    </IonContent>
  </IonPage>
);

export default CreateGroup;
