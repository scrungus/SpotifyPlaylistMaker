from fastapi import FastAPI
from starlette.requests import Request
from fastapi.middleware.cors import CORSMiddleware
import spotipy
from spotipy import oauth2
from fastapi.responses import RedirectResponse
import uuid
import os
import json
import httpx


STATE_LENGTH=16

clientID = 'cfbac69fc1fb41f28dd001bf8f2114b9'
clientSecret = '3ec8cd1f469647afa658904334e760ce'
redirect_uri = 'http://localhost:8000/api/callback/'
scopes = 'user-read-private user-read-email user-library-modify user-library-read'
state = str(uuid.uuid4()).replace("-","")[0:STATE_LENGTH]

app = FastAPI(debug=True)

origins = [
    "http://localhost:8001",
    "localhost:8001",
    "0.0.0.0:8001",
    "http://0.0.0.0:8001",
    "http://localhost:3000",
    "0.0.0.0:3000",
    "http://0.0.0.0:3000",
    "spotifyplaylistmaker_frontend_1:3000",
    "http://spotifyplaylistmaker_frontend_1:3000",
    "spotifyplaylistmaker_backend_1:8001",
    "http://spotifyplaylistmaker_backend_1:8001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

print("STATE : ",state)
sp_oauth = oauth2.SpotifyOAuth( clientID, clientSecret,redirect_uri,scope=scopes,cache_path=None,state=state)

@app.get("/",tags=["root"])
async def root(request : Request):
    return "Nothing to see here..."

@app.get("/api/login",tags=['login'])
async def login():
    state = str(uuid.uuid4()).replace("-","")[0:STATE_LENGTH]
    sp_oauth = oauth2.SpotifyOAuth( clientID, clientSecret,redirect_uri,scope=scopes,cache_path=None,state=state)
    return RedirectResponse(sp_oauth.get_authorize_url())

@app.get("/api/test", tags=['test'])
async def test(request : Request):
    return "success!"

@app.get("/api/callback", tags=['callback'])
async def callback(request : Request):
    access_token = ""
    url = str(request.query_params)
    print("URL IS :",url)
    code = parse(url)
    print("CODE IS :",code)
    if code and code != '/':
        print("Found Spotify auth code in URL! Trying to get access token...")
        try:
            token_info = sp_oauth.get_access_token(code)
            access_token = token_info['access_token']
        except:
            print("Invalid Access Token!")

    if access_token:
        print("Access token found! Getting user info...")
        sp = spotipy.Spotify(access_token)
        results = sp.current_user()

        results.update({'access_token': access_token})

        httpx.post('http://spotifyplaylistmaker_database_1:8002/addUser',json=results)   
        print("Success!")

    else:
        print("None or Invalid Access Token.")
    return RedirectResponse("http://localhost:3000/")


def parse(url):
    urlstate = url[url.rfind('=')+1:]
    print("STATE FOUND : ",urlstate)
    if state==urlstate:
        print("VALID RESPONSE")
    elif urlstate.isspace() or not urlstate:
        print("NO CODE IN URL")
        return
    else:
        print("CSRF ATTACK DETECTED!")
        print("STATE: '",state,"', URLSTATE: '",urlstate,"'")

    code = url[url.find('=')+1:url.rfind('&')]
    print("CODE FOUND :",code)
    return code