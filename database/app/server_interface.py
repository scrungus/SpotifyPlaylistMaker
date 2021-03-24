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

#Once data is returned from the database it is just an array, so this takes in the information and puts it into
#a dictionary so its clearer which data is which
def userDataFormat(id=None, username=None, spotify_auth=None, spotify_id=None):
    data = {}
    if(id != None):
        data["id"] = id
    if(username != None):
        data["username"] = username
    if(spotify_auth != None):
        data["spotify_auth"] = spotify_auth
    if(spotify_id != None):
        data["spotify_id"] = spotify_id
    return data


class DatabaseConnector:
    def __init__(self):
        self.connection = self.createConnection()

    def createConnection(self):
        hostName = "86.8.33.127"
        userName = "client"
        userPassword = "spm2021"
        database = "user_data"
        connection = None

        try:

            connection = mysql.connector.connect(

                host=hostName,

                user=userName,

                password=userPassword,
                database=database,
                buffered=True,
                auth_plugin='mysql_native_password'

            )
            connection.cursor().execute("SET SESSION MAX_EXECUTION_TIME=1000")
            connection.autocommit = True
            print("Connection to MySQL DB successful")

        except mysql.connector.Error as err:

            print(f"The error '{err}' occurred")

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

    def getUser(self, id=None, username=None, spotifyID=None):
        if(id != None):
            sql = "SELECT * FROM users WHERE user_id = %(user_id)s"
            val = {"user_id": id}
        elif(spotifyID != None):
            sql = "SELECT * FROM users WHERE spotify_id = %(spotify_id)s"
            val = {"spotify_id": spotifyID}
        elif(username != None):
            sql = "SELECT * FROM users WHERE username = %(username)s"
            val = {"username": username}
        else:
            return {"success": False, "data": None, "error": "No parameters set"}

        cursor = self.connection.cursor()
        cursor.execute(sql, val)
        res = cursor.fetchall()

        if(len(res) == 0):
            return {"success": False, "data": None, "error": "User doesnt exist"}

        return {
            "success": True, 
            "data": userDataFormat(id=res[0][0], username=res[0][1], spotify_auth=res[0][2], spotify_id=res[0][3]),
            "error": ""}

    def addUser(self, username: str, spotifyID: str, displayName: str, spotifyAuth=None, image=None):
        user = self.getUser(spotifyID=spotifyID)
        if(user["success"] == True):
            cursor = self.connection.cursor()
            cursor.execute("UPDATE users SET spotify_auth=%(spotify_auth)s WHERE spotify_id=%(spotify_id)s", {
                "spotify_auth": spotifyAuth,
                "spotify_id": spotifyID
                })
            self.connection.commit()
            return {"success": True, "error": ""}

        sql = "INSERT INTO users (username, spotify_auth, spotify_id, display_name) VALUES (%(username)s, %(spotify_auth)s, %(spotify_id)s, %(display_name)s)"
        val = {"username": username,
               "spotify_auth": spotifyAuth, 
               "spotify_id": spotifyID,
               "display_name": displayName
               }
        try:
            self.connection.cursor().execute(sql, val)
        except mysql.connector.errors.IntegrityError:
            return {"success": False, "error": "User already exists with user and or ID"}

        self.connection.commit()
        return {"success": True, "error": ""}

    def getAllUser(self):
        sql = "SELECT * FROM users"
    
        cursor = self.connection.cursor()
        cursor.execute(sql)
        res = cursor.fetchall()

        if(len(res) == 0):
            return {"success": False, "data": None, "error": "No Users"}

        return ({
            
            "success": True, 
            "data": userDataFormat(id=res[i][0], username=res[i][1], spotify_auth=res[i][2], spotify_id=res[i][3]),
            "error": ""} for i in range(len(res)))

    def addPlaylist(self, link: str, spotifyID=None, groupID=None):
        if(spotifyID == None and groupID == None):
            return {"success": False, "error": "userID and groupID cannot both be blank"}

        userID = None
        if(spotifyID != None):
            user = self.getUser(spotifyID=spotifyID)
            if(user["success"] == False):
                return user
        else:
            groupID = hashBack(groupID)
            cursor = self.connection.cursor()
            cursor.execute("SELECT * FROM user_groups WHERE group_id=%(group_id)s", { "group_id": groupID })
            res = cursor.fetchall()

            if(len(res) == 0):
                return {"success": False, "error": "code doesnt exist"}

        sql = "INSERT INTO playlists (link, spotify_id, group_id) VALUES (%(link)s, %(spotify_id)s, %(group_id)s)"
        val = {"link": link, "spotify_id": spotifyID, "group_id": groupID }

        self.connection.cursor().execute(sql, val)
        self.connection.commit()
        return {"success": True, "error": ""}

    def getPlaylists(self, spotifyID=None, groupID=None):

        

        if(spotifyID != None):
            sql = """
            SELECT playlists.*
            FROM playlists 
            INNER JOIN (
            users INNER JOIN user_groups
            ) 
            ON playlists.group_id = user_groups.group_id
            WHERE users.spotify_id = %(spotify_id)s
            """
            val = {"spotify_id": spotifyID} 
        else:
            sql = "SELECT * FROM playlists WHERE group_id = %(group_id)s"
            val = {"group_id": hashBack(groupID)}

        cursor = self.connection.cursor()
        cursor.execute(sql, val)
        res = cursor.fetchall()

        for i in range(len(res)):
            res[i] = zip(["playlist_id", "link", "spotifyID", "groupID"], res[i])

        return {"success": True, "data": res, "error": ""}

    def checkGroupName(self, name: str, creatorID: str):
        sql = "SELECT * FROM user_groups WHERE group_name=%(name)s AND creator=%(creatorID)s"
        val = {"name": name, "creatorID": creatorID}

        cursor = self.connection.cursor()
        cursor.execute(sql, val)
        res = cursor.fetchall()

        if(len(res) > 0):
            return False
        return True

    def addGroup(self, name: str, creatorID: str):

        userData = self.getUser(spotifyID=creatorID)
        if(userData["success"] == False):
            return {"success": False, "data": None, "error": "The creator doesnt exist"}

        if(self.checkGroupName(name, creatorID) == False):
            return {"success": False, "data": None, "error": "Group name already exists for that user"}

        sql = "INSERT INTO user_groups (creator, group_name) VALUES (%(creator)s, %(name)s)"
        val = {"creator": creatorID, "name": name}
        cursor = self.connection.cursor()
        cursor.execute(sql, val)
        self.connection.commit()

        cursor = self.connection.cursor()
        cursor.execute("SELECT group_id FROM user_groups WHERE creator=%(creatorID)s AND group_name=%(name)s", {"creatorID": creatorID, "name": name})
        self.connection.commit()
        res = cursor.fetchall()

        sql = "INSERT INTO group_members (group_id, user_id) VALUES (%(group_id)s, %(user_id)s)"
        val = {"group_id": res[0][0], "user_id":userData['data']['id']}
        cursor = self.connection.cursor()
        cursor.execute(sql, val)
        self.connection.commit()
        

        return {"success": True, "data": hashForward(res[0][0]), "error": ""}

    def getAllGroups(self):
        sql = "SELECT * FROM user_groups"
    
        cursor = self.connection.cursor()
        cursor.execute(sql)
        res = cursor.fetchall()

        if(len(res) == 0):
            return {"success": False, "data": None, "error": "No Groups"}

        out = []
        for r in res:
            out.append({
                "Invite Code" : hashForward(r[0]),
                "Creator" : r[1],
                "Name" : r[2]
            })
        return ({
            
            "success": True, 
            "data": out,
            "error": ""})

    def getAllGroupMembers(self):
        sql = "SELECT * FROM group_members"
    
        cursor = self.connection.cursor()
        cursor.execute(sql)
        res = cursor.fetchall()

        if(len(res) == 0):
            return {"success": False, "data": None, "error": "No Groups"}

        return ({
            
            "success": True, 
            "data": res,
            "error": ""})

    def addGroupMember(self, spotifyID: str, groupCode: str):
        groupID = hashBack(groupCode)
        userData = self.getUser(spotifyID=spotifyID)
        if(userData["success"] == False):
            return {"success": False, "data": None, "error": "User doesnt exist"}
            
        userID = userData["data"]["id"]

        sql = "INSERT INTO group_members (user_id, group_id) VALUES (%(user_id)s, %(group_id)s)"
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
        if(len(group) == 0):
            return {"success": False, "data": None, "error": "group does not exist"}

        sql = "SELECT user_id FROM group_members WHERE group_id=%(group_id)s"
        val = {"group_id": groupID}
        cursor = self.connection.cursor()
        cursor.execute(sql, val)
        userIDs = cursor.fetchall()
        userIDs.append([group[0][1]])

        users = []
        for ID in userIDs:
            res = self.getUser(id=ID[0])["data"]
            if(res and len(res) > 0):
                users.append({"id": res["spotify_id"], "username": res["username"]})
        


        return {
            "success": True, 
            "data": { 
                "group": {
                    "name": group[0][0],
                    "creator": group[0][1]
                }, 
                "users": users 
                }, 
            "error": ""
        }

    def getUsersGroups(self, id=None, username=None, spotify_id=None):
        res = self.getUser(id=id, username=username, spotifyID=spotify_id)
        if(res["success"] == False):
            return res
        user = res["data"]
        print("user : ",user)
        sql = """
            SELECT user_groups.group_id, user_groups.group_name 
            FROM user_groups 
            INNER JOIN group_members 
            ON user_groups.group_id = group_members.group_id 
            WHERE user_groups.creator=%(user_id)s
            
            """

        sql = """
            SELECT user_groups.group_id, user_groups.group_name 
            FROM user_groups 
            WHERE user_groups.creator=%(user_id)s
        """
        if id:
            val = {"user_id": user["id"]}

        elif spotify_id:
            print("passing spotify id")
            val = {"user_id": user["spotify_id"]}
        
        cursor = self.connection.cursor()
        cursor.execute(sql, val)
        res = cursor.fetchall()
        out = []
        print("res :",res)
        for r in res:
            out.append({
                "group_code": hashForward(r[0]),
                "group_name": r[1]
            })

        return {"success": True, "data": out, "error": None}
