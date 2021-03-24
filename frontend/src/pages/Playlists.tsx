import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonList, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import PlaylistBox from '../components/PlaylistContainer';
import './Playlists.css';
import React, { useEffect, useState } from 'react';
import { contrastOutline, refresh } from 'ionicons/icons';
import { sendRequestAsync } from '../hooks/requestManager'
import { get, set } from "../hooks/useStorage";
import { refreshCircle, cloudDownloadSharp } from 'ionicons/icons';

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

let active = false;

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
  let getUsersHttp: XMLHttpRequest;
  let getPlaylistHttp: Array<XMLHttpRequest>;
  let responseBuffer: Array<Object>;

  let cancelReq = () => {
    if (getUsersHttp) {
      getUsersHttp.abort();
    }

    getPlaylistHttp.forEach(val => {
      if (val) {
        val.abort();
      }
    });
  }

  useEffect(() => {
    if (active == true) {
      cancelReq();
      console.log("cancelled requests");
    }

    active = true;

    getUsersHttp = sendRequestAsync("GET", 8002, "getUserPlaylists", { id: currUserID }, "playlists");
    getUsersHttp.onreadystatechange = (e) => {
      if (getUsersHttp.readyState == 4) {
        let val = getUsersHttp.response;

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
          if (!data) {
            return;
          }
          getPlaylistHttp = Array(data.length);
          data.forEach((play, index) => {
            getPlaylistHttp[index] = sendRequestAsync("GET", 8001, "getplaylistinfo", { id: play.link, tkn: currUserAuth }, `playlistinfo${index}`);

            getPlaylistHttp[index].onreadystatechange = e => {
              if (getPlaylistHttp[index].readyState == 4) {
                val = getPlaylistHttp[index].response;
                if (val) {
                  try {
                    let playlistInfo = JSON.parse(val);
                    data[index].name = playlistInfo.name;
                    data[index].link = playlistInfo.external_urls.spotify;
                    resolveCount++;
                  } catch (err) {
                    failedCount++;
                  } finally {
                    if (resolveCount == data.length - failedCount) {
                      active = false;
                      setPlaylists(data);
                    }
                  }

                }
              }
            }
          });
        }
      }
    }
    return () => {
      if (getPlaylistHttp) {
        getPlaylistHttp.forEach(element => {
          element.onreadystatechange = () => { };
        });
      }
      if (getUsersHttp) { getUsersHttp.onreadystatechange = () => { }; }
    };
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
          {(active) ?
            <IonItem>
              <IonText color="primary">
                <h2>Loading...</h2>
              </IonText>
            </IonItem>
            :
            playlists.map((play: any, index: number) => {
              return (
                <IonItem key={index}>
                  <PlaylistBox name={play.name} link={play.link} icon={"icon"}></PlaylistBox>
                </IonItem>
              )
            })}
        </IonList>
        <IonFab vertical="top" horizontal="end" slot="fixed" edge>
          <IonFabButton onClick={() => { setRefresh(Date.now()) }}>
            <IonIcon icon={(active) ? cloudDownloadSharp : refreshCircle} />
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
