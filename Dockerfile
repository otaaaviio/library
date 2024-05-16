FROM node:20-alpine as node

WORKDIR /usr/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .