import mysql.connector
from mysql.connector import Error
import time

class DatabaseConnector:
    def __init__(self):
        self.connection = self.createConnection("86.8.33.127", "client", "spm2021", "user_data")

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
            val = {"user_id" : id}
        else:
            sql = "SELECT * FROM users WHERE username = %(username)s"
            val = {"username" : username}
        
        cursor = self.connection.cursor()
        cursor.execute(sql, val)
        return {"success": True, "data": cursor.fetchall(), "error": ""}



    def addUser(self, username: str, spotifyID: str, spotifyAuth=None):
        sql = "INSERT INTO users (username, spotify_auth, spotify_id) VALUES (%(username)s, %(spotify_auth)s, %(spotify_id)s)"
        val = {"username": username, "spotify_auth": spotifyAuth, "spotify_id": spotifyID}
        try:
            self.connection.cursor().execute(sql, val)
        except mysql.connector.errors.IntegrityError:
            return {"success": False, "error": "User already exists with user and or ID"}

        self.connection.commit()
        return {"success": True, "error": ""}

    def addPlaylist(self, link, userID=None, groupID=None):
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

