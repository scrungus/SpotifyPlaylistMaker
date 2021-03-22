import React, { useState, useContext } from "react";
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Callback from './pages/MainTabs';
import MainTabs from './pages/MainTabs';
import Login from './pages/Login';
import CreateGroup from './pages/CreateGroup'

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

class DebugRouter extends IonReactRouter {
  constructor(props : any){
    super(props);
    console.log('initial history is: ', JSON.stringify(this.history, null,2))
    this.history.listen((location, action)=>{
      console.log(
        `The current URL is ${location.pathname}${location.search}${location.hash}`
      )
      console.log(`The last navigation action was ${action}`, JSON.stringify(this.history, null,2));
    });
  }
}

const IonicApp: React.FC = () => {
  /* Depending on whether isLoggedIn is false or true, the page will
     either become the login screen with no tab bar, or the original
     screen with the tab bar and the currently selected tab. */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = useContext(UserContext);
  user.setIsLoggedIn = setIsLoggedIn;

  // TODO: Make logging in persist across page loads/reloads,
  // then remove the exact path="/create_group" line.
  return (
    <IonApp>
      <DebugRouter>
        <IonRouterOutlet>
          <Route exact path="/login" component={Login} />
          <Redirect exact from="/" to="/login"/>
          <Route exact path="/main_tabs" component={MainTabs} />
          <Route path="/callback/:id" component={Callback} />
          {/* <Route path="/:id" component={isLoggedIn ? MainTabs : Login} /> */}
          <Route exact path="/create_group" component={CreateGroup} />
        </IonRouterOutlet>
      </DebugRouter>
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
