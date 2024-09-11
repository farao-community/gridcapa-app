# GridCapa web application
[![MPL-2.0 License](https://img.shields.io/badge/license-MPL_2.0-blue.svg)](https://www.mozilla.org/en-US/MPL/2.0/)

This repository contains the web application GridCapa. It is built on GridSuite application template.

## Build and run web application

First download all needed dependencies.

```bash
npm install
```

Then start the application.

```bash
npm start
```

The application can now be reached on http://localhost:3000.

## Build docker image

For building Docker image of the application, start by creating a production build.

```bash
npm run build
```

Then build docker image

```bash
docker build -t farao/gridcapa-app .
```
