FROM node:13-alpine as build


WORKDIR /usr/src/app 

ENV CHOKIDAR_USEPOLLING=true

COPY package*.json /usr/src/app/

RUN apk --no-cache --update --virtual build-dependencies add \
    python \
    make \
    g++ \
    && npm install \
    && apk del build-dependencies

RUN npm install -g ionic
RUN npm install

COPY . /usr/src/app/

EXPOSE 3000

CMD [ "npm", "start" ]



