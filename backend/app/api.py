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
import json 

STATE_LENGTH=16

clientID = 'cfbac69fc1fb41f28dd001bf8f2114b9'
os.environ['SPOTIPY_CLIENT_ID'] = 'cfbac69fc1fb41f28dd001bf8f2114b9'
clientSecret = '3ec8cd1f469647afa658904334e760ce'
os.environ['SPOTIPY_CLIENT_SECRET'] = '3ec8cd1f469647afa658904334e760ce'
redirectURI = 'http://localhost:8001/'
os.environ['SPOTIPY_REDIRECT_URI'] = 'http://localhost:8001/'

scopes = 'user-follow-modify user-read-private user-read-email user-library-modify user-library-read user-top-read playlist-read-collaborative playlist-modify-private playlist-modify-public playlist-read-private user-follow-read user-read-recently-played'

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

#creates a playlist and fills it with some songs
@app.get("/generatePlaylist", tags=['generatePlaylist'])
async def generatePlaylist(id : List[str] = Query(None)):
    usernames = []
    tokens = []
    sp = []
    playlistNames = []

    for idx in id:
        with httpx.Client() as client:
            user = client.get('http://spotifyplaylistmaker_database_1:8002/getUserBySpotifyID'+'?spotifyID='+idx).text
        user = json.loads(user)
        print(user)
        usernames.append(user['data']['username'])
        tokens.append(user['data']['spotify_auth'])

    reducedArtists = []
    track_list = []

    #spot = spotipy.Spotify(tokens[0], auth_manager=SpotifyOAuth(client_id=clientID, client_secret=clientSecret, scope=scopes))
    spot = spotipy.Spotify(tokens[0], client_credentials_manager=SpotifyClientCredentials())


    # generate playlist names and description
    playlistDescription = 'This is an automated playlist generated for the following group:'
    for grp_member in range(len(tokens)):
        playlistDescription += ' ' + usernames[grp_member]
        
        sp.append(spotipy.Spotify(tokens[grp_member], client_credentials_manager=SpotifyClientCredentials()))
        playlists = sp[grp_member].user_playlists(usernames[grp_member])
        latestPlaylist = 0
        for item in playlists['items']:
            if item['name'][0:14] == 'Group Playlist' and len(item['name']) == 14 and latestPlaylist < 2:
                latestPlaylist = 1
            if item['name'][0:14] == 'Group Playlist' and len(item['name']) > 14 and int(item['name'][15:len(item['name'])]) > latestPlaylist:
                latestPlaylist = int(item['name'][15:len(item['name'])])

        if latestPlaylist == 0:
            playlistNames.append('Group Playlist')
        else:
            playlistNames.append('Group Playlist ' + str(latestPlaylist + 1))

    # get 5 most common artists from each user
    for grp_member in range(len(tokens)):
        createdPlaylist = sp[grp_member].user_playlist_create(usernames[grp_member], playlistNames[grp_member], public=False, collaborative=True, description=playlistDescription)
        allArtists = []
        playlists = sp[grp_member].user_playlists(usernames[grp_member])
        for playlist in playlists['items']:
            if playlist['owner']['id'] == usernames[grp_member]:
                results = sp[grp_member].user_playlist(usernames[grp_member], playlist['id'], fields="tracks")
                tracks = results['tracks']
                for item in tracks['items']:
                    track = item['track']
                    if(track['artists'][0]['uri'] != None):
                        allArtists.append(track['artists'][0]['uri'])
                    
        reducedArtists += Counter(allArtists).most_common(5)
    for i, artist in enumerate(reducedArtists):
        reducedArtists[i] = reducedArtists[i][0]

    # get recommendation for group
    print(reducedArtists)
    tracks = spot.recommendations(seed_artists=reducedArtists, limit=20)
    for track in tracks['tracks']:
       track_list.append(track['uri'])

    # add recommendation for all users
    spot.playlist_add_items(createdPlaylist['uri'], track_list)
    for grp_member in range(len(tokens)):
        if grp_member != 1:
            sp[grp_member].user_playlist_follow_playlist(usernames[grp_member], playlist_id=createdPlaylist['id'])
    a = spotipy.Spotify(tokens[0], auth_manager=SpotifyOAuth(client_id=clientID, client_secret=clientSecret, scope=scopes))

    # return playlist id
    return createdPlaylist['id']

# takes in access token and playlist id
# returns playlist as json
@app.get("/getplaylistinfo", tags=['getplaylistinfo'])
async def getplaylistinfo(id : str, tkn : str):
    sp = spotipy.Spotify(tkn, auth_manager=SpotifyOAuth(client_id=clientID, client_secret=clientSecret, scope=scopes))
    return sp.playlist(playlist_id=id)