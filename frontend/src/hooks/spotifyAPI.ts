import { set } from './useGroupStorage';

export function sendGetRequest() {  
  const http = new XMLHttpRequest();
  const url = "http://localhost:8000/login";
  http.open("GET", url);
  http.send();
  
  http.onreadystatechange = (e) => {
    set("redirectLink", http.responseURL);
  }
}