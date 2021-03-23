import { 
  IonContent, 
  IonHeader, 
  IonList, 
  IonPage, 
  IonTitle, 
  IonToolbar} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Settings.css';

const Settings: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
        </IonList>
        <ExploreContainer name="Tab 3 page" />
      </IonContent>
    </IonPage>
  );
};

export default Settings;
