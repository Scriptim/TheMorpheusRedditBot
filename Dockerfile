FROM node:8.9-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY . .
RUN npm install --production --silent
RUN apk add --no-cache git
CMD npm start
