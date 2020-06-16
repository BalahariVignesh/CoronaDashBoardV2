FROM redis:latest
FROM mongo:latest
FROM neo4j:latest
FROM node:latest

ENV NODE_ENV=production
ENV PORT=8080

WORKDIR .

COPY package*.json ./
COPY . .


RUN npm install

EXPOSE 8080

ENTRYPOINT [ "node","server.js" ]