# Node.js TypeScript Starter Project

This project is a simple and lightweight Node.js boilerplate using TypeScript. It includes Docker configurations to run the application in both development and production modes, along with enhanced security features such as rate limiting and brute force protection.

---

Check our latest complete boilerplate for NodeTs [Node Typescript Wizard](https://github.com/fless-lab/ntw-init)

## Table of Contents

- [Node.js TypeScript Starter Project](#nodejs-typescript-starter-project)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
  - [Project Structure](#project-structure)
  - [Environment Variables](#environment-variables)
  - [Security Features](#security-features)
    - [Rate Limiting](#rate-limiting)
    - [Brute Force Protection](#brute-force-protection)
    - [Hiding Technology Stack](#hiding-technology-stack)
    - [Content Security Policy](#content-security-policy)
  - [Commit Message Guidelines](#commit-message-guidelines)
    - [Commit Message Format](#commit-message-format)
    - [Setting Up Commitlint](#setting-up-commitlint)
  - [Accessing Services](#accessing-services)

## Prerequisites

Ensure you have the following installed on your system:

- Node.js (version 18 or above)
- Docker
- Docker Compose

## Installation

To set up the project, follow these steps:


1. **Run the installation script**:

    This script will:
    - Copy the `.env.example` file to `.env`.
    - Install the necessary npm dependencies.

## Running the Application

You can run the application in either development or production mode.


## Project Structure

Here is an overview of the project's structure:

```
/home/raouf/workspaces/personnal/projects/node-ts-starter
├── .eslintrc.json
├── .env
├── .env.example
├── .eslintignore
├── .prettierrc
├── Dockerfile
├── package.json
├── package-lock.json
├── README.md
├── src
│   ├── app
│   │   ├── builders
│   │   │   ├── BaseQueryBuilder.ts
│   │   │   ├── index.ts
│   │   │   └── UserQueryBuilder.ts
│   │   ├── controllers
│   │   │   ├── app.controller.ts
│   │   │   ├── index.ts
│   │   │   └── user.controller.ts
│   │   ├── models
│   │   │   ├── index.ts
│   │   │   └── user.model.ts
│   │   ├── routes
│   │   │   ├── app.routes.ts
│   │   │   ├── routes.ts
│   │   │   └── user.routes.ts
│   │   ├── services
│   │   │   ├── index.ts
│   │   │   └── user.service.ts
│   ├── config
│   │   └── index.ts
│   ├── constants
│   │   └── index.ts
│   ├── dependencies
│   │   ├── database
│   │   │   ├── mongoose
│   │   │   │   └── db.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── helpers
│   │   └── db-connection-test.ts
│   ├── express.ts
│   ├── server.ts
├── commitlint.config.js
├── tsconfig.json
└── .prettierignore
```

## Environment Variables

The `.env` file contains the environment variables required by the application. It is generated from the `.env.example` file during installation. Ensure the following variables are set:

```env
# Engine
PORT=9095
ENABLE_CLIENT_AUTH=true

# Client authentication
BASIC_AUTH_USER=admin
BASIC_AUTH_PASS=secret

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Brute force protection
BRUTE_FORCE_FREE_RETRIES=5
BRUTE_FORCE_MIN_WAIT=300000
BRUTE_FORCE_MAX_WAIT=3600000
BRUTE_FORCE_LIFETIME=86400

# Database
DB_URI=mongodb://mongo:27017
DB_NAME=mydatabase
MONGO_CLIENT_PORT=9005


```


## Security Features

### Rate Limiting

The rate limiter middleware is configured to limit the number of requests to the API within a specified time window. This helps protect against DoS attacks.

### Brute Force Protection

Brute force protection is implemented using `express-brute` and `express-brute-mongo`. It limits the number of failed login attempts and progressively increases the wait time between attempts after reaching a threshold.

### Hiding Technology Stack

The `helmet` middleware is used to hide the `X-Powered-By` header to

 obscure the technology stack of the application.

### Content Security Policy

A strict content security policy is enforced using the `helmet` middleware to prevent loading of unauthorized resources.


## Commit Message Guidelines

To ensure consistent commit messages, this project uses commitlint with husky to enforce commit message guidelines.

### Commit Message Format

- **build**: Changes that affect the build system or external dependencies
- **chore**: Miscellaneous changes that don't affect the main codebase (e.g., configuring development tools, setting up project-specific settings)
- **ci**: Changes to our CI configuration files and scripts
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **update**: Update something for a specific use case
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (e.g., white-space, formatting, missing semi-colons)
- **test**: Adding missing tests or correcting existing tests
- **translation**: Changes related to translations or language localization
- **sec**: Changes that address security vulnerabilities, implement security measures, or enhance the overall security of the codebase

### Setting Up Commitlint

Commitlint and Husky are already configured and set up to ensure that commit messages follow the specified format before they are committed to the repository.

## Accessing Services

After running the application, you can access the following services:

- **Node.js Application**: [http://localhost:9095](http://localhost:9095)
- **MongoDB**: Accessible on port `9005`
