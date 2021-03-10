import { set } from './useGroupStorage';

export function sendGetRequest() {  
  const http = new XMLHttpRequest();
  const url = "/api/login";
  http.open("GET", url);
  http.setRequestHeader("Access-Control-Allow-Origin", "https://accounts.spotify.com/");
  http.setRequestHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  http.send();
  
  /* http.onreadystatechange = (e) => {
    set("redirectLink", http.responseURL);
  } */
}