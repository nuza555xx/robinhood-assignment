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

## Seed data

- [ ] Run docker swarm or mongodb container

```bash
# docker exec mongodb
$ docker exec -it -w /root mongodb /bin/bash
```

```bash
# auth and connect
$ mongosh --host CONTAINER_NAME --port PORT --username USERNAME --password PASSWORD --authenticationDatabase admin TARGET_DB
```

```bash
# seed role
$ db.roles.insertMany([{ "label": "Administrator", "slug": "administrator" }, { "label": "User", "slug": "user" }])
```

```bash
# exit db
$ exit
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
