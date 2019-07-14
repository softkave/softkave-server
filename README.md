# SOFTKAVE

## Product Overview

Softkave is currently a task and project management application intended for people and enterprises. The interface or the design thinking is user first, cause in the end, even the biggest of enterprises are made up of, and are built by people, and they are the ones that make decisions.

### Main Features

1. Personal task and project management
2. Notifications management
3. Organizations
4. Groups
5. Projects
6. Tasks

## Server Repo

### Architecture

**Express Server** -> **GraphQL** -> **Endpoints ( Business Logic )** -> **Mongo DB ( Using Mongoose )**

### Development

The primary tool for development is Microsoft's vscode, because the editor can be auto-configured using the configurations of the project. Some of the configurations include debugging, linting, code style guide, etc.

Also, some extensions are required to take advantage of the configurations, they are:

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [TSLint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin)

### Run Application

- Run `npm install`
- Run `npm local-start` for local development
- Run through vscode debugger for debugging, it is pre-configured
