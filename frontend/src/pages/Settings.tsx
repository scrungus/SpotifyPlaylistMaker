import { 
  IonContent, 
  IonItem, 
  IonHeader, 
  IonList, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonIcon, 
  IonLabel, 
  IonToggle 
} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { moon } from 'ionicons/icons';
import './Settings.css';

const Settings: React.FC = () => {
  const toggleDarkModeHandler = () => {
    document.body.classList.toggle("dark");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItem>
            <IonIcon slot="start" icon={moon}/>
            <IonLabel>Dark Mode</IonLabel>
            <IonToggle
              slot="end"
              name="darkMode"
              onIonChange={toggleDarkModeHandler}
            />
          </IonItem>
        </IonList>
        <ExploreContainer name="Tab 3 page" />
      </IonContent>
    </IonPage>
  );
};

export default Settings;
