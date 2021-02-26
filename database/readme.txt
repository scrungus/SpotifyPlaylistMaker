
----INSTALL-----
Make sure you have python 3.9.x installed otherwise it will have a hissy fit
Now run this command to enable you to run these commands
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

In CMD go to the Scripts folder and run:
activate.bat
then your command line should look like this:
(python-virtual-environments)
now run install.bat in this new command line
this should install it all for you

----API-----
request type  |     route name      |       parameters      |       request body        |
get           | getUserByUsername   | username (string)     |            None           |
get           | getUserByID         | id (int)              |            None           |
post          | addUser             | None                  | username (string)         |
              |                     |                       | spotifyAuth(string or "") |
              |                     |                       | spotifyID (string)        |
post          | addUserPlaylist     | None                  | link (string)             |
              |                     |                       | id (int)                  |          
post          | addGroupPlaylist    | None                  | link (string)             |
              |                     |                       | id (int)                  |
get           | getUserPlaylists    | id (int)              |            None           |         
get           | getGroupPlaylist    | id (int)              |            None           |
