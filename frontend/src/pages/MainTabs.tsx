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
