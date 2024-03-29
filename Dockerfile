FROM node:18

WORKDIR /usr/src/app

ENV PORT 8080 

COPY package*.json ./

RUN npm install

COPY . .

CMD npm start