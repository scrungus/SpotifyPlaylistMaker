export function sendGetRequest() {  
  const http = new XMLHttpRequest();
  const url = "http://localhost:8000/login";
  http.open("GET", url);
  http.send();
  
  http.onreadystatechange = (e) => {
    console.log(http.responseText)
  }
}

/*
TODO overcome CORS policy:
Access to XMLHttpRequest at 'http://localhost:8000/login' from origin 'http://localhost:8100'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
*/
