# Library Management System

## Overview

The Library Management System is a comprehensive platform designed to facilitate the efficient management of library
resources.
It provides a seamless interface for users to register books, provide ratings, and share their thoughts.

## Key Features

### User Registration and Authentication

Our system ensures secure access to its features by implementing a robust user registration and authentication process.
Users can create their own accounts, which are required to access some system's functionalities.

### CRUD Operations

The system allows users to perform CRUD operations on books, publishers, reviews, authors.

### Endpoints

- /books
- /publishers
- /reviews
- /authors
- /users
- /sessions

#### All endpoints, except /sessions, support the following HTTP methods:

```GET /``` Get all

```GET /:id``` Get by id

```POST /``` Create

```PUT /:id``` Update by id

```DELETE /:id``` Delete by id

## Getting Started

### Prerequisites

This project requires the following dependencies:

- [Docker compose](https://docs.docker.com/compose/install/)

### Installation

1. Clone the repo

```sh
git clone https://github.com/otaaaviio/library.git
```

2. Run the following command to build the project

```sh
docker compose build
```

3. Run the following command to start the project

```sh
docker compose up
```

## Development

### Running the tests

To run the tests, run the following command

```sh
docker exec -it library-node npm run test
```

## Built With

* [NestJS](https://nestjs.com) - The web framework used
* [Prisma](https://www.prisma.io) - ORM
* [PostgreSQL](https://www.postgresql.org) - Database
* [Docker](https://www.docker.com) - Containerization
* [Jest](https://jestjs.io) - Testing framework

## Contributing

Fork the project and create a pull request.

## Conclusion

This project is built using modern technologies such as NestJS, Prisma, PostgreSQL, and Docker, demonstrating the
ability to work with cutting-edge tools and frameworks. The use of Docker for containerization also shows an
understanding of deployment and scalability issues.

The project's focus on testing with Jest indicates a commitment to quality and reliability.

Overall, this Library Management System serves as a portfolio piece that showcases a wide range of skills and a
deep understanding of software development principles with NestJS. It stands as a testament to the ability to design,
implement, and manage a full-featured, secure, and efficient system.

## Author

* **Otávio Gonçalves** - [linkedin](https://www.linkedin.com/in/otaaaviio/)