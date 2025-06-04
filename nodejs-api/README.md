# NODEJS API

This is a modified excerpt from a personal project. It has been modifed so that the server can run locally and an example client script can consume the api endpoints.

The server code defines a tRPC server. More reading and documentation about tRPC can be found [here](https://trpc.io/docs/concepts).

The `src/shared` has been left for the purpose of example code reference but it is not exposed on the API for the sake of simplicity since these services connect to dynamoDB tables or an opensearch instance.

## Prerequisites
Node JS v20 or later

Install node modules
```bash
npm run install
```

## Running the server

```bash
npm run server
```

## Running the client

This will simply run a script that initalizes a tRPC client to consume the tRPC server and output results to stdout.

```bash
npm run client
```