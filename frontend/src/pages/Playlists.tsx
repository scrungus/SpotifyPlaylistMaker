import { IonContent, IonHeader, IonItem, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import PlaylistBox from '../components/PlaylistContainer';
import './Playlists.css';
import React, { useEffect } from 'react';
import { contrastOutline } from 'ionicons/icons';

interface Playlist {
  name: string
  link: string
  icon: null
}

async function getPlaylistData(link: string){

}

async function getPlaylists(userID: number) {
  const http = new XMLHttpRequest();
  //let url = "http://" + process.env.REACT_APP_DB_URL + `/getUserPlaylists?id=${userID}`;
  //let url = `http://localhost:8002/getUserPlaylists?id=${userID}`;
  let url = process.env.REACT_APP_DB_URL + `/getUserPlaylists?id=${userID}`;
  console.log(url);
  http.open("GET", url);
  http.send()

  return new Promise((resolve, reject) => {
    http.onload = () => {
      console.log(http.response);
      resolve(http.response);
    }
  });
}

type PlaylistsState = {
  playlists: any;
  userID: number;
}

class Playlists extends React.Component<{}, PlaylistsState> {
  constructor(props: Playlist){
    super(props)
  }
  componentWillMount(){
    this.setState({playlists: [], userID: 18});
  }
  componentDidMount() {
    getPlaylists(this.state.userID).then((data: any) => {
      data = JSON.parse(data);
      this.setState({playlists: (data.data), userID: 18});
    });
  }



  render() {
    let userID = 18;


    //let playlists = [{name: "p1", link: "http://www.google.com", icon: null}, {name: "p2", link: "http://www.spotify.com", icon: null}];


    //let playlists = getPlaylists(userID);

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Playlists</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonList>
            {
              this.state.playlists.map((play: any, index: number) => {
                return (
                  <IonItem key={index}>
                    <PlaylistBox name={"name"} link={play[1]} icon={"icon"}></PlaylistBox>
                  </IonItem>
                )
              })
            }
          </IonList>
        </IonContent>
      </IonPage>
    );
  }
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
