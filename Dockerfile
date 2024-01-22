FROM node:21-alpine3.18

ENV PNPM_HOME="/pnpm"

ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY ./dist .

COPY package.json ./

ENV PORT=80

EXPOSE ${PORT}

RUN pnpm install

CMD ["pnpm", "run", "start:prod"]