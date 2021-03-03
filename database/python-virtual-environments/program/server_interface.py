import mysql.connector
import base64
from mysql.connector import Error
import time


def hashForward(num):
    return base64.b64encode(
        str(num).encode("ascii")
    ).decode("ascii")


def hashBack(code):
    return int(base64.b64decode(
        code.encode("ascii")
    ).decode("ascii"))




class DatabaseConnector:
    def __init__(self):
        self.connection = self.createConnection(
            "86.8.33.127", "client", "spm2021", "user_data")

    def createConnection(self, hostName, userName, userPassword, database):

        connection = None

        try:

            connection = mysql.connector.connect(

                host=hostName,

                user=userName,

                password=userPassword,
                database=database

            )

            print("Connection to MySQL DB successful")

        except Error as e:

            print(f"The error '{e}' occurred")

        return connection

    def end(self):
        self.connection.close()

    def usernameExists(self, username: str):
        sql = f"SELECT user_id FROM users WHERE username='{username}'"
        cursor = self.connection.cursor()
        cursor.execute(sql)

        res = cursor.fetchall()
        if(len(res) == 0):
            return -1
        else:
            return res[0]

    def getUser(self, id=None, username=None):
        if(id != None):
            sql = "SELECT * FROM users WHERE user_id = %(user_id)s"
            val = {"user_id": id}
        else:
            sql = "SELECT * FROM users WHERE username = %(username)s"
            val = {"username": username}

        cursor = self.connection.cursor()
        cursor.execute(sql, val)
        res = cursor.fetchall()

        if(len(res) == 0):
            return {"success": False, "data": None, "error": "User doesnt exist"}

        return {"success": True, "data": res, "error": ""}

    def addUser(self, username: str, spotifyID: str, spotifyAuth=None):
        sql = "INSERT INTO users (username, spotify_auth, spotify_id) VALUES (%(username)s, %(spotify_auth)s, %(spotify_id)s)"
        val = {"username": username,
               "spotify_auth": spotifyAuth, "spotify_id": spotifyID}
        try:
            self.connection.cursor().execute(sql, val)
        except mysql.connector.errors.IntegrityError:
            return {"success": False, "error": "User already exists with user and or ID"}

        self.connection.commit()
        return {"success": True, "error": ""}

    def addPlaylist(self, link: str, userID=None, groupID=None):
        if(userID == None and groupID == None):
            return {"success": False, "error": "userID and groupID cannot both be blank"}

        sql = "INSERT INTO playlists (link, user_id, group_id) VALUES (%(link)s, %(user_id)s, %(group_id)s)"
        val = {"link": link, "user_id": userID, "group_id": groupID}

        self.connection.cursor().execute(sql, val)
        self.connection.commit()
        return {"success": True, "error": ""}

    def getPlaylists(self, userID=None, groupID=None):
        if(userID != None):
            sql = "SELECT playlist_id, link, user_id FROM playlists WHERE user_id = %(user_id)s"
            val = {"user_id": userID}
        else:
            sql = "SELECT playlist_id, link, group_id WHERE group_id = %(group_id)s"
            val = {"group_id": groupID}

        cursor = self.connection.cursor()
        cursor.execute(sql, val)
        return {"success": True, "data": cursor.fetchall(), "error": ""}

    def checkGroupName(self, name: str, creatorID: int):
        sql = "SELECT * FROM user_groups WHERE group_name=%(name)s AND creator=%(creatorID)s"
        val = {"name": name, "creatorID": creatorID}

        cursor = self.connection.cursor()
        cursor.execute(sql, val)
        res = cursor.fetchall()

        if(len(res) > 0):
            return False
        return True

    def addGroup(self, name: str, creatorID: int):
        if(self.getUser(id=creatorID)["success"] == False):
            return {"success": False, "data": None, "error": "The creator doesnt exist"}

        if(self.checkGroupName(name, creatorID) == False):
            return {"success": False, "data": None, "error": "Group name already exists for that user"}
        

        sql = "INSERT INTO user_groups (creator, group_name) VALUES (%(creator)s, %(name)s)"
        val = {"creator": creatorID, "name": name}

        cursor = self.connection.cursor()
        cursor.execute(sql, val)
        self.connection.commit()
        return {"success": True, "data": None, "error": ""}

    def addGroupMember(self, userID: int, groupCode: str):
        groupID = hashBack(groupCode)

        if(self.getUser(id=userID)["success"] == False):
            return {"success": False, "data": None, "error": "User doesnt exist"}

        sql = "INSERT INTO group_members (group_id, user_id) VALUES (%(group_id)s, %(user_id)s)"
        val = {"group_id": groupID, "user_id": userID}
        
        self.connection.cursor().execute(
            sql, val
        )
        self.connection.commit()

        return {"success": True, "data": None, "error": ""}

    def getGroupMembers(self, groupCode: str):
        groupID = hashBack(groupCode)
        sql = "SELECT group_name, creator FROM user_groups WHERE group_id=%(group_id)s"
        val = {"group_id": groupID}

        cursor = self.connection.cursor()
        cursor.execute(sql, val)
        group = cursor.fetchall()

        sql = "SELECT user_id FROM group_members WHERE group_id=%(group_id)s"
        val = {"group_id": groupID}
        cursor = self.connection.cursor()
        cursor.execute(sql, val)
        userIDs = cursor.fetchall()

        users = []
        for ID in userIDs:
            print(ID)
            res = self.getUser(id=ID[0])["data"][0]
            users.append({"id": res[0], "username": res[1]})


        return {
            "success": True, 
            "data": { 
                "group": group, 
                "users": users 
                }, 
            "error": ""
        }

