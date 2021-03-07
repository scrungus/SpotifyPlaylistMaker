from fastapi import FastAPI
from starlette.requests import Request
from fastapi.middleware.cors import CORSMiddleware
import spotipy
from spotipy import oauth2, util
from spotipy.oauth2 import SpotifyClientCredentials
from fastapi.responses import RedirectResponse
import uuid
import os
<<<<<<< HEAD
import http3
=======
>>>>>>> master

STATE_LENGTH=16

clientID = 'cfbac69fc1fb41f28dd001bf8f2114b9'
os.environ['SPOTIPY_CLIENT_ID'] = 'cfbac69fc1fb41f28dd001bf8f2114b9'
clientSecret = '3ec8cd1f469647afa658904334e760ce'
os.environ['SPOTIPY_CLIENT_SECRET'] = '3ec8cd1f469647afa658904334e760ce'
redirectURI = 'http://localhost:8000/'
scopes = 'user-read-private user-read-email user-library-modify user-library-read playlist-modify-private playlist-read-private'
state = str(uuid.uuid4()).replace("-","")[0:STATE_LENGTH]
# username hard coded in atm, but we will get the name from the database
username = 'yatintanna'
<<<<<<< HEAD
client = http3.AsyncClient()
=======
>>>>>>> master

app = FastAPI()
token = ''
origins = [
<<<<<<< HEAD
    'dwboutthisbro'
=======
    "http://localhost:3000",
    "localhost:3000"
>>>>>>> master
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

print("STATE : ",state)
sp_oauth = oauth2.SpotifyOAuth( clientID, clientSecret,redirectURI,scope=scopes,cache_path='.spotipyoauthcache',state=state)

@app.get("/",tags=["root"])
async def root(request : Request):
    access_token = ""

    token_info = sp_oauth.get_cached_token()

    if token_info:
        print("Found cached token!")
        access_token = token_info['access_token']
    else:
        url = str(request.query_params)
        print("url is :",url)
        code = parse(url)
        print("CODE IS ",code)
        if code and code != '/':
            print("Found Spotify auth code in URL! Trying to get access token...")
            token_info = sp_oauth.get_access_token(code)
            access_token = token_info['access_token']

    if access_token:
        print("Access token found! Getting user info...")
        sp = spotipy.Spotify(access_token)
        print(access_token)
        results = sp.current_user()
        return results

    else:
        return "No Access Token."

@app.get("/login",tags=['login'])
async def login():
    return RedirectResponse(sp_oauth.get_authorize_url())


def parse(url):
    urlstate = url[url.rfind('=')+1:]
    print("STATE FOUND : ",urlstate)
    if state==urlstate:
        print("VALID RESPONSE")
    else:
        print("CSRF ATTACK DETECTED!")

    code = url[url.find('=')+1:url.rfind('&')]
    print("CODE FOUND :",code)
    return code

#playlist code:

#creates a playlist and fills it with some songs
@app.get("/createplaylist", tags=['createplaylist'])
async def test():
<<<<<<< HEAD
=======
    sp_oauth.get_access_token()
>>>>>>> master
    sp = spotipy.Spotify(auth=sp_oauth.get_access_token()['access_token'], auth_manager=SpotifyClientCredentials())
    sp.user_playlist_create(username, 'test', public=False, collaborative=False, description='description')
    playlist = sp.artist_top_tracks('spotify:artist:36QJpDe2go2KgaRleHCDTp')
    tracks = []
    for track in playlist['tracks']:
        t = track['uri']
        tracks.append(track['uri'])
    print(tracks)
    playlists = sp.user_playlists(username)
    for item in playlists['items']:
        if item['name'] == 'test':
            id = item['uri']
    sp.playlist_add_items(id, tracks)

    return "playlist created successfully"

#adds some songs to an existing playlist
@app.get("/editplaylist", tags=['editplaylist'])
async def addtoplaylist():
<<<<<<< HEAD
    sp = spotipy.Spotify(auth=sp_oauth.get_access_token()['access_token'], auth_manager=SpotifyClientCredentials())
=======
    sp = spotipy.Spotify(auth=sp_oauth.get_access_token()['access_token'], auth_manager=SpotifyClientCredentials());
>>>>>>> master
    playlists = sp.user_playlists(username)
    for item in playlists['items']:
        if item['name'] == 'test':
            id = item['uri']
    tracks = ['spotify:track:2BjBfSbmAqqg4FumwVQYCV', 'spotify:track:0UAJH0k4k3slcE83a9UGCe']
    sp.playlist_add_items(id, tracks)

<<<<<<< HEAD
    return "playlist edited successfully"

@app.get("/test", tags=['test'])
async def test(request : Request):
    return (await client.get('http://spotifyplaylistmaker_auth_1:8000/test')).text
    
=======
    return "playlist edited successfully"
>>>>>>> master
