from fastapi import FastAPI,Query
from starlette.requests import Request
from fastapi.middleware.cors import CORSMiddleware
import spotipy
from spotipy import oauth2, util
from spotipy.oauth2 import SpotifyClientCredentials
from spotipy.oauth2 import SpotifyOAuth
from fastapi.responses import RedirectResponse, HTMLResponse
import uuid
import os
import httpx
from typing import List
from collections import Counter

STATE_LENGTH=16

clientID = 'cfbac69fc1fb41f28dd001bf8f2114b9'
os.environ['SPOTIPY_CLIENT_ID'] = 'cfbac69fc1fb41f28dd001bf8f2114b9'
clientSecret = '3ec8cd1f469647afa658904334e760ce'
os.environ['SPOTIPY_CLIENT_SECRET'] = '3ec8cd1f469647afa658904334e760ce'
redirectURI = 'http://localhost:8001/'
os.environ['SPOTIPY_REDIRECT_URI'] = 'http://localhost:8001/'
scopes = 'user-read-private user-read-email user-library-modify user-library-read user-top-read playlist-modify-private playlist-read-private user-follow-read user-read-recently-played'
state = str(uuid.uuid4()).replace("-","")[0:STATE_LENGTH]
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

#playlist code:

#creates a playlist and fills it with some songs
@app.get("/generatePlaylist", tags=['generatePlaylist'])
async def generatePlaylist(id : List[str] = Query(None)):

    usernames = []
    tokens = []
    sp = []

    for idx in id:
        user = await client.get('http://spotifyplaylistmaker_database_1:8002/getUserByID'+'?id='+idx)
        usernames.append(user.username)
        tokens.append(user.spotify_auth)

   

    reducedArtists = []
    track_list = []

    # get 5 most common artists from each user
    for grp_member in range(len(tokens)):
        sp.append(spotipy.Spotify(tokens[grp_member], auth_manager=SpotifyOAuth(client_id=clientID, client_secret=clientSecret, redirect_uri=redirectURI, scope=scopes)))
        sp[grp_member].user_playlist_create(usernames[grp_member], 'test13', public=False, collaborative=False, description='description')
        allArtists = []
        playlists = sp[grp_member].user_playlists(usernames[grp_member])
        for playlist in playlists['items']:
            if playlist['owner']['id'] == usernames[grp_member]:
                results = sp[grp_member].user_playlist(usernames[grp_member], playlist['id'], fields="tracks")
                tracks = results['tracks']
                for item in tracks['items']:
                    track = item['track']
                    allArtists.append(track['artists'][0]['uri'])
        reducedArtists += Counter(allArtists).most_common(5)
    for i, artist in enumerate(reducedArtists):
        reducedArtists[i] = reducedArtists[i][0]

    # get recommendation for group
    spot = spotipy.Spotify(tokens[0], auth_manager=SpotifyOAuth(client_id=clientID, client_secret=clientSecret, redirect_uri=redirectURI, scope=scopes))
    tracks = spot.recommendations(seed_artists=reducedArtists, limit=20)
    for track in tracks['tracks']:
       track_list.append(track['uri'])

    # add recommendation for all users
    for grp_member in range(len(tokens)):
        sp.append(spotipy.Spotify(tokens[grp_member], auth_manager=SpotifyOAuth(client_id=clientID, client_secret=clientSecret, redirect_uri=redirectURI, scope=scopes)))
        playlists = spot.user_playlists(usernames[grp_member])
        for item in playlists['items']:
            if item['name'] == 'test13':
                id = item['uri']
        sp[grp_member].playlist_add_items(id, track_list)

    return "playlist created successfully"

#adds some songs to an existing playlist
""" @app.get("/editplaylist", tags=['editplaylist'])
async def addtoplaylist(id : str, pid : str):
    sp = spotipy.Spotify(auth=sp_oauth.get_access_token()['access_token'], auth_manager=SpotifyClientCredentials())
    playlists = sp.user_playlists(username)
    for item in playlists['items']:
        if item['name'] == 'test':
            id = item['uri']
    tracks = ['spotify:track:2BjBfSbmAqqg4FumwVQYCV', 'spotify:track:0UAJH0k4k3slcE83a9UGCe']
    sp.playlist_add_items(id, tracks)

    return "playlist edited successfully"
    

    # get 5 most common artists from each user
    for grp_member in range(len(tokens)):
        sp.append(spotipy.Spotify(tokens[grp_member], auth_manager=SpotifyOAuth(client_id=clientID, client_secret=clientSecret, redirect_uri=redirectURI, scope=scopes)))
        sp[grp_member].user_playlist_create(usernames[grp_member], 'test13', public=False, collaborative=False, description='description')
        allArtists = []
        playlists = sp[grp_member].user_playlists(usernames[grp_member])
        for playlist in playlists['items']:
            if playlist['owner']['id'] == usernames[grp_member]:
                results = sp[grp_member].user_playlist(usernames[grp_member], playlist['id'], fields="tracks")
                tracks = results['tracks']
                for item in tracks['items']:
                    track = item['track']
                    allArtists.append(track['artists'][0]['uri'])
        reducedArtists += Counter(allArtists).most_common(5)
    for i, artist in enumerate(reducedArtists):
        reducedArtists[i] = reducedArtists[i][0]

    # get recommendation for group
    spot = spotipy.Spotify(tokens[0], auth_manager=SpotifyOAuth(client_id=clientID, client_secret=clientSecret, redirect_uri=redirectURI, scope=scopes))
    tracks = spot.recommendations(seed_artists=reducedArtists, limit=20)
    for track in tracks['tracks']:
       track_list.append(track['uri'])

    # add recommendation for all users
    for grp_member in range(len(tokens)):
        sp.append(spotipy.Spotify(tokens[grp_member], auth_manager=SpotifyOAuth(client_id=clientID, client_secret=clientSecret, redirect_uri=redirectURI, scope=scopes)))
        playlists = spot.user_playlists(usernames[grp_member])
        for item in playlists['items']:
            if item['name'] == 'test13':
                id = item['uri']
        sp[grp_member].playlist_add_items(id, track_list)

    return "playlist created successfully" """