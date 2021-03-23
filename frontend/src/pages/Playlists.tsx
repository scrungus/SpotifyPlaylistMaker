import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import PlaylistBox from '../components/PlaylistContainer';
import './Playlists.css';
import React, { useEffect, useState } from 'react';
import { contrastOutline, refresh } from 'ionicons/icons';
import { sendRequest } from '../hooks/requestManager'
import { get, set } from "../hooks/useStorage";
import { refreshCircle } from 'ionicons/icons';

interface Playlist {
  name: string
  icon: string
  playlist_id: number
  link: string
  spotifyID: string
  groupID: string
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

  sendRequest("GET", 8002, "getUserPlaylists", params, "playlists")
  const playlists = get("playlists");
  playlists.then((val) => {
    if (val.success) {
      return JSON.parse(val).data;
    }
  })
  return [];
}


const Playlists: React.FC = () => {

  const [playlists, setPlaylists] = useState<Array<Playlist>>([]);
  const [refreshPlaylists, setRefresh] = useState<number>(0);

  // const getModal = (group: Group) => {
  //   setSelectedGroup(group);
  //   setShowModal(true);
  // }

  const currUser = JSON.parse(document.cookie.split('; ')[0].slice(5))
  const currUserID = currUser.spotify_id;
  const currUserAuth = currUser.spotify_auth;
  console.log(currUserID);

  useEffect(() => {
    console.log("HERE");
    let cancel = false;
    sendRequest("GET", 8002, "getUserPlaylists", { id: currUserID }, "playlists");
    get("playlists")
      .then((val) => {
        if (cancel) {
          return;
        }
        console.log(val);
        if (val && val != "") {
          val = JSON.parse(val);
        } else {
          console.error("Couldnt parse");
          return;
        }
        if (val.success) {
          let data = val.data as Array<Playlist>
          let resolveCount = 0;
          let failedCount = 0;
          data.forEach((play, index) => {
            sendRequest("GET", 8001, "getplaylistinfo", { id: play.link, tkn: currUserAuth }, `playlistinfo${index}`);

            get(`playlistinfo${index}`)
              .then(val => {
                if (cancel) {
                  return;
                }
                if (val) {
                  try {
                    let playlistInfo = JSON.parse(val);
                    data[index].name = playlistInfo.name;
                    data[index].link = playlistInfo.external_urls.spotify;
                    resolveCount++;
                  } catch {
                    failedCount++;
                  } finally {
                    if (resolveCount == data.length - failedCount) {
                      setPlaylists(data);
                    }
                  }

                }
              });

          });
        }
      })
    return () => {
      cancel = true;
    }
  }, [refreshPlaylists]);

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
                <PlaylistBox name={play.name} link={play.link} icon={"icon"}></PlaylistBox>
              </IonItem>
            )
          })}
        </IonList>
        <IonFab vertical="top" horizontal="end" slot="fixed" edge>
          <IonFabButton onClick={() => {setRefresh(Date.now())}}>
            <IonIcon icon={refreshCircle} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
}

/*


          

{
*/


export default Playlists;
