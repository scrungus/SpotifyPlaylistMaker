import { 
  IonContent, 
  IonHeader, 
  IonList, 
  IonPage, 
  IonTitle, 
  IonToolbar} from '@ionic/react';
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
      </IonContent>
    </IonPage>
  );
};

export default Settings;
