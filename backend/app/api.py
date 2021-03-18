from fastapi import FastAPI,Query
from starlette.requests import Request
from fastapi.middleware.cors import CORSMiddleware
import spotipy
from spotipy import oauth2, util
from spotipy.oauth2 import SpotifyClientCredentials
from fastapi.responses import RedirectResponse, HTMLResponse
import uuid
import os
import httpx
from typing import List

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
client = httpx.AsyncClient()

app = FastAPI()
token = ''
origins = [
    "http://localhost:3000",
    "localhost:3000",
    "http://localhost:8001",
    "localhost:8001",
    "0.0.0.0:8001",
    "http://0.0.0.0:8001",
    "http://localhost:8000",
    "localhost:8000",
    "0.0.0.0:8000",
    "http://0.0.0.0:8000",
    "spotifyplaylistmaker_frontend_1:3000",
    "http://spotifyplaylistmaker_frontend_1:3000",
    "spotifyplaylistmaker_backend_1:8001",
    "http://spotifyplaylistmaker_backend_1:8001",
    "spotifyplaylistmaker_auth_1:8000",
    "http://spotifyplaylistmaker_auth_1:8000",
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

#playlist code:

#creates a playlist and fills it with some songs
@app.get("/generatePlaylist", tags=['generatePlaylist'])
async def generatePlaylist(id : List[str] = Query(None)):
    """ sp = spotipy.Spotify(auth=sp_oauth.get_access_token()['access_token'], auth_manager=SpotifyClientCredentials())
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

    return "playlist created successfully" """

#adds some songs to an existing playlist
@app.get("/editplaylist", tags=['editplaylist'])
async def addtoplaylist(id : str, pid : str):
    sp = spotipy.Spotify(auth=sp_oauth.get_access_token()['access_token'], auth_manager=SpotifyClientCredentials())
    playlists = sp.user_playlists(username)
    for item in playlists['items']:
        if item['name'] == 'test':
            id = item['uri']
    tracks = ['spotify:track:2BjBfSbmAqqg4FumwVQYCV', 'spotify:track:0UAJH0k4k3slcE83a9UGCe']
    sp.playlist_add_items(id, tracks)

    return "playlist edited successfully"
    
