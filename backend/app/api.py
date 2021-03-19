from fastapi import FastAPI
from starlette.requests import Request
from fastapi.middleware.cors import CORSMiddleware
import spotipy
from spotipy import oauth2, util
from spotipy.oauth2 import SpotifyClientCredentials
from spotipy.oauth2 import SpotifyOAuth
from fastapi.responses import RedirectResponse, HTMLResponse
import uuid
import os
import http3
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
# username hard coded in atm, but we will get the name from the database
client = http3.AsyncClient()

app = FastAPI()
token = ''
origins = [
    'dwboutthisbro'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

print("STATE : ",state)


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


#creates a playlist and fills it with some songs
@app.get("/createplaylist", tags=['createplaylist'])
async def createplaylist():
    # get list of usernames and access tokens from database for group
    # usernames and tokens should be appended to the usernames and tokens lists
    # with usernames[n] corresponding to tokens[n]

    usernames = []
    tokens = []
    sp = []


    reducedArtists = []
    track_list = []

    # placeholders for testing
    tokens.append('BQCBynWtrcQo9IY9qGT78M6TMS7wm4cBd5_oGPYdrDivDQLFkJlrKRdPALSTYzWZF7kEs83wkBKcOZulbKChTI9u6-2N_v9USx8lVvec_MrCHuAmxpDVbTOsjDvKFHK7utxfbu4VK7-PMiNusijJfLFhd7jSR82lZAbmCuxMMp3sGCTgzlazUMbjuRL5b1HF_Ack02doLUAg-xhMYSRjo1rD_lVjf3FRwSb-3OJ_ogNkguqyi5wBuedn')
    usernames.append('yatintanna')

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