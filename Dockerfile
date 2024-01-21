FROM node:21-alpine3.18

WORKDIR /app

COPY ./dist .

COPY package.json ./

ENV PORT=80

EXPOSE ${PORT}

RUN yarn install

CMD ["yarn", "run", "start:prod"]