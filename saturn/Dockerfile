FROM node:17.8.0-bullseye

WORKDIR /home/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install --silent

COPY . ./

EXPOSE 3000

CMD [ "npm", "start" ]
