import { set } from './useGroupStorage';

export async function SendGetRequest() {  
  const url = "/api/login";
  
  const resp = await fetch(url, {method : 'GET', redirect : 'follow'})

  window.location.href = resp.url;

  /* http.onreadystatechange = (e) => {
    set("redirectLink", http.responseURL);
  } */
}