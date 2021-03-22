import { IonContent, IonHeader, IonItem, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import PlaylistBox from '../components/PlaylistContainer';
import './Playlists.css';
import React, { useEffect, useState } from 'react';
import { contrastOutline } from 'ionicons/icons';
import { sendRequest } from '../hooks/requestManager' 
import { get } from "../hooks/useGroupStorage";

interface Playlist {
  name: string
  link: string
  icon: null
}

// async function getPlaylistData(link: string){
//   const http = new XMLHttpRequest();
//   let port = process.env.REACT_APP_BACKEND_PORT || "8001";
//   let domain = process.env.REACT_APP_SERVER_URL || "localhost";
//   let url = domain + ":" + port + `/getPlaylists?link=${link}`;
//   console.log(url);
//   http.open("GET", url);
//   http.withCredentials = true;
//   http.setRequestHeader("Content-Type", "application/json");
//   http.send();

//   return new Promise((resolve, reject) => {
//     http.onload = () => {
//       console.log(http.response);
//       resolve(http.response);
//     }
//   });
// }

type PlaylistsState = {
  playlists: any;
  userID: number;
}

async function getUsersPlaylists(userId: number | string): Promise<Playlist[]> {
  const params = {
    id: userId
  }

  sendRequest("GET", "getUserPlaylists", params, "playlists")
  const playlists = get("playlists");
  playlists.then((val) => {
    if(val.success){
      return JSON.parse(val).data;
    }
  })
  return [];
}




const Playlists: React.FC = () => {

  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  // const getModal = (group: Group) => {
  //   setSelectedGroup(group);
  //   setShowModal(true);
  // }

  const currUserID = JSON.parse(document.cookie).spotify_id;
  console.log(currUserID);
  sendRequest("GET", "getUserPlaylists", { id: currUserID }, "playlists");

  useEffect(() => {
    const playlists_promise = getUsersPlaylists(currUserID);
    playlists_promise.then((values) => {
      if (values !== null) { 
        setPlaylists(values);
      }
    });
  }, [currUserID]);




  //let playlists = [{name: "p1", link: "http://www.google.com", icon: null}, {name: "p2", link: "http://www.spotify.com", icon: null}];



  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Playlists</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {playlists.map((play: any, index: number) => {
            return (
              <IonItem key={index}>
                <PlaylistBox name={"name"} link={play[1]} icon={"icon"}></PlaylistBox>
              </IonItem>
            )
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
}

/*
{
            {
        playlists: [
          { name: "p1", link: "http://www.google.com", icon: null },
          { name: "p2", link: "http://www.spotify.com", icon: null }
        ]
      }
          } 
          */


export default Playlists;
