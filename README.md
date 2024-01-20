## Installation

```bash
$ yarn install
```

## Build the app

```bash
# nest build
$ yarn run build

```

## Build the app to docker file

- [ ] Compile source code ./dict

```bash
# docker build
$ docker build -t backend:latest  -f Dockerfile .

```

## Docker swarm

- [ ] Build the app to docker image

```bash
# database and service
$ docker-compose up -d

```

## Running the app on localhost

- [ ] Build the app to docker-compose

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
