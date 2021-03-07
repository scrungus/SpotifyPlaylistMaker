import React from 'react'
import { 
    IonContent,
    IonHeader, 
    IonPage, 
    IonTitle, 
    IonToolbar, 
    IonRow, 
    IonCol, 
    IonIcon, 
    IonItem,
    IonLabel, 
    IonInput, 
    IonButton, 
} from '@ionic/react';

import * as utils from '../hooks/useGroupStorage'

import { personCircle } from 'ionicons/icons'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

// /* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
// import '../theme/variables.css';

const Login: any = () => {
  return (
    <IonPage>
        <IonContent fullscreen>
            <IonRow>
                    <IonCol>
                    <IonIcon
                    style={{ fontSize: "70px", color: "#0040ff" }}
                    icon={personCircle}
                    />
                </IonCol>
            </IonRow>

            <IonRow>
                <IonCol>
                    <IonItem>
                        <IonLabel position="floating"> Email</IonLabel>
                        <IonInput
           type="email"
                            // value={email}
                            // onIonChange={(e) => utils.setEmail(e.detail.value!)}
                            >
                        </IonInput>
                    </IonItem>
                </IonCol>
            </IonRow>

            <IonRow>
                <IonCol>
                    <IonButton expand="block">Login</IonButton>
                    <IonItem routerLink="/tab1">
                        <IonLabel>Tab 1</IonLabel>
                    </IonItem>
                </IonCol>
            </IonRow>
        </IonContent>




    </IonPage>
  );
};

export default Login;
