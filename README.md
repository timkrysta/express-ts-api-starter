# TypeScript based Express.js API Starter

## Introduction
This repository is a future-proof starter for building backend API. It uses all the latest versions of packages.

Built with:
- `Express.js`
- `JWT - Json Web Token`
- `MongoDB`
- `TypeScript`

It includes the following endpoints:
- `/api/v1/auth/register` - registers a new user
- `/api/v1/auth/login` - returns a JWT

## Installation
- `git clone REPOSITORY.git`
- `cd ./node-express-api-starter`
- `cp .env.example .env`

## Usage
- `docker-compose up`

## TODO
- Extend tests
    - Extend `AuthController.test.ts` testsuite with: 
        - testing invaild registration data (aggainst validation rules)
    - Extend `UserController.ts`testsuite with:
        - testing that none of the endpoint returns password hash or `__v` in json response
- Security
    - protect `/api/v1/auth/register` API endpoint with `captcha` & rate limiting not to be spammed with automated scripts
    - add proper errorhandling: 
        - recommended by node.js https://strongloop.com/strongblog/robust-node-applications-error-handling/
        - https://dev.to/admirnisic/error-handling-in-node-js-with-express-part-2-30lb
    - add proper validation: https://dev.to/admirnisic/data-validation-with-express-and-nodejs-k8g
- Validation
    - change validation mechanism from `express-validator` to `joi` because it has bigger community

## Concerns
- all places returning: `err.` in json object can be dangerous (by exposing sensitive stuff)

## Notes
- About `target` in `tsconfig.json` (by default was `es5`) but in deciding here is some resources:
    - https://node.green/
    - https://github.com/microsoft/TypeScript/wiki/Node-Target-Mapping

## Ideas
- maybe store everything in one route file or one file per api version
- alternative modular structure to consider
    - config
    - src
        - index.js
        - users
            - user.controllers.js
            - user.model.js
            - user.routes.js
            - user.validations.js
        - services
            - auth.services.js
