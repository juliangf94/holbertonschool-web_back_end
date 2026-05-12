# Node JS Basic

## Description

This project covers Node.js fundamentals: running JavaScript with Node, using built-in modules (`fs`, `http`, `process`), creating HTTP servers with Node and Express, and organizing a server with a layered architecture using ES6 and Babel.

## Learning Objectives

- Run JavaScript using NodeJS
- Use NodeJS modules (CommonJS and ES6)
- Use the `fs` module to read files synchronously and asynchronously
- Use `process` to access command line arguments and environment variables
- Create a small HTTP server using Node JS native `http` module
- Create a small HTTP server using Express JS
- Create advanced routes with Express JS
- Use ES6 with Node JS with Babel-node
- Use Nodemon to develop faster

## Requirements

- NodeJS 20.x
- All files use `.js` extension
- ESLint with airbnb-base config
- Jest for testing

## Provided files

- `database.csv` — student data used in several tasks

## Setup

```bash
npm install
```

## Run files

```bash
# Basic files (CommonJS) — Tasks 0-7
node <filename>

# Task 5 and 7 — pass CSV as argument
node 5-http.js database.csv
node 7-http_express.js database.csv

# Task 8 full server (ES6 + Babel)
npm run dev
```

## Test and lint

```bash
npm run test
npm run full-test
```

## Tasks

| File | Description |
|------|-------------|
| `0-console.js` | `displayMessage` — prints a string to STDOUT |
| `1-stdin.js` | Reads user name from stdin, prints it, shows closing message on EOF |
| `2-read_file.js` | `countStudents` — reads CSV synchronously, logs student counts by field |
| `3-read_file_async.js` | `countStudents` — same as above but async, returns a Promise |
| `4-http.js` | HTTP server (native) — responds `Hello Holberton School!` to any route |
| `5-http.js` | HTTP server (native) — `/` greeting, `/students` reads CSV async |
| `6-http_express.js` | Express server — responds `Hello Holberton School!` at `/` only |
| `7-http_express.js` | Express server — `/` greeting, `/students` reads CSV async |
| `full_server/` | Layered Express server using ES6 modules and Babel |

### Task 8 — full_server structure

```
full_server/
├── utils.js                  # readDatabase — reads CSV, returns object of arrays per field
├── controllers/
│   ├── AppController.js      # GET /
│   └── StudentsController.js # GET /students, GET /students/:major
├── routes/
│   └── index.js              # wires routes to controllers
└── server.js                 # Express app, port 1245
```

## Author

Julian Gonzalez Fernandez
