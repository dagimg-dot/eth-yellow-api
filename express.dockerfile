FROM node:lts-alpine3.9

WORKDIR /usr/src/app

ARG PORT

EXPOSE ${PORT}

RUN apk add yarn

COPY package.json ./

RUN yarn install

COPY server ./server/

COPY config ./config/

COPY middlewares ./middlewares/

COPY controllers ./controllers/

COPY utils ./utils/

COPY graphql ./graphql/

CMD ["node", "server/server.js"]
