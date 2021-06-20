# Web-based Spotify Playlist Generation
Generate playlists with personal reccommendations, join groups with your friends and create playlists combining all your music interests.

This project is structured with a microservice architecture; there are 4 seperate services - Web, Database, Backend playlist generation and an Authentication service. The containers are orchestrated with Docker Compose

### Docker Guide
To get docker environment working, install docker and docker-compose. Make sure docker service is running on your machine. Then should just be a case of running 'docker-compose up --build' with admin permissions to build and deploy.
Get something like Kitematic if you want a management dashboard to view the docker images and networks. 
