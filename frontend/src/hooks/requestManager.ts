import { set } from './useStorage';

// Parses parameters for get requests
function parse(dict: any) {
  let outString = "";
  for (let key in dict) {
    outString += `${key}=${dict[key]}&`;
  }
  return outString;
}

export function authRequest() {
  const http = new XMLHttpRequest();
  const url = "http://localhost:8000/api/login";
  http.open("GET", url);
  http.send();
  
  http.onreadystatechange = (e) => {
    set("redirectLink", http.responseURL);
  }
}

// Should be able to handle all database API requests
export function sendRequest(type: "GET" | "POST", port: number, route: string, params_or_body: any, storageKey?: string) {
  /** Don't set storageKey for POST requests */
  const http = new XMLHttpRequest();
  switch (type) {
    case "GET": {
      console.log("sending request ...")
      const params = parse(params_or_body);
      const url = `http://localhost:${port}/${route}?${params}`;
      http.open(type, url);
      http.send();
      break;
    }
    case "POST": {
      const body = JSON.stringify(params_or_body);
      const url = `http://localhost:${port}/${route}`;
      http.open(type, url);
      http.send(body);
      break;
    }
  }

  http.onreadystatechange = (e) => {
    if (http.readyState == 4 && storageKey) {
      set(storageKey, http.response);
    }
  }
}

export function sendRequestAsync(type: "GET" | "POST", port: number, route: string, params_or_body: any, storageKey?: string) {
  /** Don't set storageKey for POST requests */
  const http = new XMLHttpRequest();
  switch (type) {
    case "GET": {
      console.log("sending request ...")
      const params = parse(params_or_body);
      const url = `http://localhost:${port}/${route}?${params}`;
      http.open(type, url);
      http.send();
      return http;
    }
    case "POST": {
      const body = JSON.stringify(params_or_body);
      const url = `http://localhost:${port}/${route}`;
      http.open(type, url);
      http.send(body);
      return http;
    }
  }
}
