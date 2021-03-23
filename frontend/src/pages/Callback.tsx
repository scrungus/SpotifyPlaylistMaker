import { useContext, useEffect } from 'react';
import { IonPage } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { UserContext } from "../App";
import { get } from '../hooks/useGroupStorage';
import { sendRequest } from '../hooks/requestManager';

interface UserDetailPageProps extends RouteComponentProps<{
  id: string;
}> {}

function setCookie(data: object, maxAge: number) {
  // document.cookie = `data=;expires=${new Date(0)};path=/`;
  var d = new Date();
  d.setTime(d.getTime() + maxAge);
  var expires = `expires ${d.toUTCString()}`;
  document.cookie = `data=${JSON.stringify(data)};expires=${expires};path=/;`
}

const Callback: React.FC<UserDetailPageProps> = ({match}) => {
  const user = useContext(UserContext);

  console.log("id :: " + match.params.id); 
  //will need to check this id, since everything comes through here (e.g. 'groups' page will be read as id=groups)
  /* This part allows the user to log in if they use a valid username
     and password. We want probably want to make the request to the
     auth service from here. */

  useEffect(() => {
    if (match.params.id !== undefined) {
      sendRequest("GET", "getUserBySpotifyID", { spotifyID: match.params.id }, "currentUser");
  
      const cUserPromise = get("currentUser");
      cUserPromise.then((val) => {
        try {
          console.log("val: ", val);
          val = JSON.parse(val);
          if (val.success) {
            setCookie(val.data, 60 * 60 * 1000);
            if (val.data.spotify_id === JSON.parse(document.cookie.split('; ')[0].slice(5)).spotify_id) {
              console.log("user logged in")
              user.setIsLoggedIn(true);
              window.location.href = "/main_tabs";
            }
          } else {
            console.log("user doesnt exist");
          }
        }
        catch(e) {
          console.error(e);
          console.log("invalid user data");
        } 
      });
    }
  }, [match.params.id, user]);

  return (
    <IonPage>
    </IonPage>
  );
}

export default Callback;
