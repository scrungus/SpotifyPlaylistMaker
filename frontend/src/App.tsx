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
import Login from './pages/Login';
import CreateGroup from './pages/CreateGroup';
import Groups from './pages/Groups';
import Playlists from './pages/Playlists';
import Settings from './pages/Settings';

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
import './theme/variables.css';

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          {/* TODO implement login screen with no tabs */}
          {/* <Route exact path="/login">
            <Login />
          </Route> */}
          <Route exact path="/groups">
            <Groups />
          </Route>
          <Route exact path="/playlists">
            <Playlists />
          </Route>
          <Route exact path="/settings">
            <Settings />
          </Route>
          <Route exact path="/create_group">
            <CreateGroup />
          </Route>
          <Route exact path="/">
            <Redirect to="/groups"/>
          </Route>
          {/* TODO change default to login */}
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="groups" href="/groups">
            <IonIcon icon={people} />
            <IonLabel>Groups</IonLabel>
          </IonTabButton>
          <IonTabButton tab="playlists" href="/playlists">
            <IonIcon icon={menu} />
            <IonLabel>Playlists</IonLabel>
          </IonTabButton>
          <IonTabButton tab="settings" href="/settings">
            <IonIcon icon={settings} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
