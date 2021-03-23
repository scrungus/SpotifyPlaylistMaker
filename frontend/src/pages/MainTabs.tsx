import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { people, menu, settings } from 'ionicons/icons';
import Groups from './Groups';
import Playlists from './Playlists';
import Settings from './Settings';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
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
import '../theme/variables.css';

const MainTabs: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/main_tabs/groups">
            <Groups />
          </Route>
          <Route exact path="/main_tabs/playlists">
            <Playlists />
          </Route>
          <Route exact path="/main_tabs/settings">
            <Settings />
          </Route>
          <Route exact path="/main_tabs">
            <Redirect to="/main_tabs/groups"/>
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="groups" href="/main_tabs/groups">
            <IonIcon icon={people} />
            <IonLabel>Groups</IonLabel>
          </IonTabButton>
          <IonTabButton tab="playlists" href="/main_tabs/playlists">
            <IonIcon icon={menu} />
            <IonLabel>Playlists</IonLabel>
          </IonTabButton>
          <IonTabButton tab="settings" href="/main_tabs/settings">
            <IonIcon icon={settings} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default MainTabs;
