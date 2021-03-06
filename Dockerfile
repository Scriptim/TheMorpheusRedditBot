FROM node:8.9-alpine
LABEL maintainer "Scriptim <Scriptim@gmx.de>"
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY . .
RUN npm install --production --silent
RUN apk add --no-cache git
EXPOSE 8080
CMD npm start
