FROM node:20-alpine
WORKDIR /app

COPY package.json /app 
COPY yarn.lock /app
RUN yarn

COPY . /app 
CMD yarn dev

ENV PORT 8000
EXPOSE $PORT