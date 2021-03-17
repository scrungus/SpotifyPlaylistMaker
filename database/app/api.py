from fastapi import FastAPI
from starlette.requests import Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

from . import server_interface

db : server_interface.DatabaseConnector #defines the type of this variable
db = server_interface.DatabaseConnector() #Inits connection with server

app = FastAPI()

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

@app.get("/getUserByID", tags=["getUserByID"])
async def getUserByID(id : str):
    return db.getUser(id=id)

@app.get("/getUserByUsername", tags=["getUserByUsername"])
async def getUserByUsername(username : str):
    return db.getUser(username=username)

@app.get("/getUserBySpotifyID", tags=["getUserBySpotifyID"])
async def getUserBySpotifyID(spotifyID: str):
    return db.getUser(spotifyID=spotifyID)

#Structure of post requests are defined as classes as such:
class addUserRequest(BaseModel):
    display_name: str
    id: str
    access_code: str

@app.post("/addUser",tags=["addUser"])
async def addUser(req : addUserRequest):
    print("new user added!")
    return db.addUser(req.display_name, req.id, req.access_code)

@app.post("/test",tags=["test"])
async def addUser(req : str):
    print(req)

class addPlaylistRequest(BaseModel):
    link: str
    id: int

@app.post("/addUserPlaylist", tags=["addUserPlaylist"])
async def addUserPlaylist(req : addPlaylistRequest):
    return db.addPlaylist(req.link, userID=req.id)

@app.post("/addGroupPlaylist", tags=["addGroupPlaylist"])
async def addGroupPlaylist(req : addPlaylistRequest):
    return db.addPlaylist(req.link, groupID=req.id)

@app.get("/getUserPlaylists", tags=["getUserPlaylists"])
async def getUserPlaylists(id : int):
    return db.getPlaylists(userID=id)

@app.get("/getGroupPlaylists", tags=["getGroupPlaylists"])
async def getGroupPlaylists(id : int):
    return db.getPlaylists(groupID=id)

class AddGroupRequest(BaseModel):
    creatorID: int
    name: str

@app.post("/addGroup", tags=["addGroup"])
async def addGroup(req: AddGroupRequest):
    return db.addGroup(req.name, req.creatorID)

class AddGroupMemberRequest(BaseModel):
    groupCode: str
    userID: int

@app.post("/addGroupMember", tags=["addGroupMember"])
async def addGroupMember(req: AddGroupMemberRequest):
    return db.addGroupMember(req.userID, req.groupCode)

@app.get("/getGroupMembers", tags=["getGroupMembers"])
async def getGroupMembers(groupCode: str):
    return db.getGroupMembers(groupCode)

@app.get("/getUsersGroupsByID", tags=["getUserGroupsByID"])
async def getUsersGroupsByID(id: int):
    return db.getUsersGroups(id=id)

@app.get("/getUsersGroupsByUsername", tags=["getUserGroupsByUsername"])
async def getUsersGroupsByUsername(username: str):
    return db.getUsersGroups(username=username)

@app.get("/getUsersGroupsBySpotifyID", tags=["getUserGroupsBySpotifyID"])
async def getUsersGroupsBySpotifyID(spotifyID: str):
    return db.getUsersGroups(spotify_id=spotifyID)
    

    





