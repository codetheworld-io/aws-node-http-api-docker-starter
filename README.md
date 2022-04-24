# A Serverless Typescript Template With Docker Development Environment


## Template features

This template has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

Some personal modifications are:

-   Use docker to build a local development environment(HTTP server, DynamodDB, Dynamodb admin UI)
-   Use `jest` to implement unit test
-   Use `movies` data to implement example API endpoints

## Project structure

The project codebase is mainly located within the `src` folder.\
This folder is divided in:

-   `functions` --- Containing code base and configuration for your lambda functions and apis
-   `libs` --- Containing utility shared code base between your lambdas
-   `repositories` --- Containing DynamoDB repositories code base

```
.\
├── docker\
│   └── dynamodb                             # Dynamodb mounted data folder\
├── migrations                               # Migration folder\
│   └── movies                               # `Movie` migration folder\
│       ├── index.ts                         # `Movie` migration script\
│       └── movies.json                      # `Movie` migration data\
├── src\
│   ├── functions                            # Lambdas and api configuration\
│   │   └── movies                           # `Move` manager folder\
│   │       ├── index.ts                     # `Move` lambda function configuration\
│   │       ├── movie.controller.spec.ts     # `Movie` controller spec\
│   │       ├── movie.controller.ts          # `Movie` controller\
│   │       ├── movie.router.ts              # `Movie` api router\
│   │       ├── movie.service.ts             # `Movie` service\
│   │       └── movie.services.spec.ts.      # `Movie` service spec\
│   ├── libs                                 # Shared utility folder\
│   │   ├── api-gateway.spec.ts              # Api Gateway utility spec\
│   │   ├── api-gateway.ts                   # Api Gateway utility\
│   │   ├── app.error.ts                     # Application error class\
│   │   ├── ddb-doc.spec.ts                  # DynamoDB document client spec\
│   │   ├── ddb-doc.ts                       # DynamoDB document client utility\
│   │   ├── handler-resolver.spec.ts         # Lambda function handler path resolver spec\
│   │   ├── handler-resolver.ts              # Lambda function handler path resolver\
│   │   ├── helpers.spec.ts                  # Helper spec\
│   │   └── helpers.ts                       # Helper functions\
│   └── repositories                         # Repositories folder\
│       ├── base.repository.spec.ts          # Base repository spec\
│       ├── base.repository.ts               # Base repository\
│       └── movie.repository.ts              # Movie repository\
├── Dockerfile                               # NodeJS environment dockerfile\
├── README.md\
├── api.http                                 # Http request examples\
├── docker-compose.yml                       # Application service docker compose file\
├── http-client.env.json                     # Variable for `api.http`\
├── jest.config.js                           # Jest configurations\
├── nodemon.json                             # Nodemon configuration\
├── package-lock.json                        # Package lock file\
├── package.json                             # Project package.json file\
├── serverless.template.yml                  # Serverless template definition\
├── serverless.ts                            # Serverless configurations\
├── tsconfig.build.json                      # Typescript configurations for bulding\
├── tsconfig.json                            # Typescript configurations for testing and IDE features\
└── tsconfig.paths.json                      # Typescript paths configuration
```

## Dependencies packages

None

## Dev-Dependency packages

-   [@serverless/typescript](https://www.npmjs.com/package/@serverless/typescript) --- Typescript definitions for Serverless `serverless.ts` service file.
-   [@types/aws-lambda](https://www.npmjs.com/package/@types/aws-lambda) --- Typescript type definitions for AWS Lambda
-   [@types/jest](https://www.npmjs.com/package/@types/jest) --- Typescript type definitions for Jest
-   [@types/node](https://www.npmjs.com/package/@types/node) --- TypeScript definitions for Node.js
-   [aws-sdk](https://www.npmjs.com/package/aws-sdk) --- AWS SDK for JavaScript
-   [esbuild](https://www.npmjs.com/package/esbuild) --- Javascript/Typescript bundler
-   [eslint](https://www.npmjs.com/package/eslint) --- Javascript linter tool
-   [eslint-config-airbnb-base ](https://www.npmjs.com/package/eslint-config-airbnb-base)--- Airbnb's base JS ESLint config
-   [@typescript-eslint/eslint-plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin) --- TypeScript plugin for ESLint
-   [@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser) --- ESLint custom parser which leverages TypeScript ESTree
-   [jest](https://www.npmjs.com/package/jest) --- Testing tool
-   [ts-jest](https://www.npmjs.com/package/ts-jest) - Jest Typescript transformer
-   [ts-node](https://www.npmjs.com/package/ts-node) --- TypeScript execution environment and REPL for node.js, with source map support
-   [tsconfig-paths](https://www.npmjs.com/package/tsconfig-paths) --- Load node modules according to tsconfig paths, in run-time or via API.
-   [typescript](https://www.npmjs.com/package/typescript) --- TypeScript is a language for application scale JavaScript development

## Installation/deployment instructions

-   Run `npm install` to install the project dependencies
-   Run `npm run deploy` to deploy the project stack to AWS

## Locally

Make sure your docker service is already started and docker-compose is available.

Run the following command:

-   `docker-compose up`

If you can see something like `Server ready: <http://0.0.0.0:4000> 🚀` this means the local service is ready.

In another terminal window, let's run the migration command:

-   `npm run migrate:movies`

Now you can try all APIs that are defined in `api.http` , example:

curl '[http://0.0.0.0:4000/movies/2002'](http://0.0.0.0:4000/movies/2002%27)

It will return a list of movies in 2002.

## Run unit test

-   Run `npm run test` to run all unit test
-   Run `npm run test:coverage` to run the test and generate a coverage report

## How to start with this template?

You can clone this project from [Github](https://github.com/codetheworld-io/aws-node-http-api-docker-starter) and modifie it.

Or you can use `serverless` command to create a new project with the custom template:

```
serverless create \
  --template-url https://github.com/codetheworld-io/aws-node-http-api-docker-starter \
  --path myService
```
