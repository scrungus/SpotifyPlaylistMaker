import { set } from './useGroupStorage';

export function sendGetRequest() {  
  const http = new XMLHttpRequest();
  const url = "http://spotifyplaylistmaker_auth_1:8000/login";
  http.open("GET", url);
  http.setRequestHeader("Access-Control-Allow-Origin", "*");
  http.setRequestHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  http.send();
  
  http.onreadystatechange = (e) => {
    set("redirectLink", http.responseURL);
  }
}