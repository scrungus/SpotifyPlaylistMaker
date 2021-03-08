import React, { useState, useContext } from "react";
import { Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import MainTabs from './pages/MainTabs';
import Login from './pages/Login';

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

/* Stuff related to hiding the tabs on the login screen.
   See https://stackoverflow.com/a/62362139. */
interface IUserManager {
  setIsLoggedIn: Function;
}
const user: IUserManager = {
  setIsLoggedIn: () => {}
};
export const UserContext = React.createContext<IUserManager>(user);

const IonicApp: React.FC = () => {
  /* Depending on whether isLoggedIn is false or true, the page will
     either become the login screen with no tab bar, or the original
     screen with the tab bar and the currently selected tab. */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = useContext(UserContext);
  user.setIsLoggedIn = setIsLoggedIn;

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/login" component={Login} />
          <Route path="/" component={isLoggedIn ? MainTabs : Login} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

const App: React.FC = () => {
  /* This thing basically allows other pages to access isLoggedIn
     (i.e. it lets the login page actually function). */
  return (
    <UserContext.Provider value={user}>
      <IonicApp />
    </UserContext.Provider>
  );
};

export default App;
