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

The system allows users to perform CRUD operations on books, publishers, reviews, authors, reading list of users.

### Factories

The system provides factories to generate fake data for testing purposes and populate the database with sample data.

### Tests

The system is thoroughly tested using Jest, a popular testing framework for JavaScript. The tests cover all the main
features of the system, ensuring that it works as expected.

### Redis Cache

The system uses Redis to cache the most accessed data, improving performance and reducing the load on the database.

### Docker

The system is containerized using Docker, making it easy to deploy and scale.

### Endpoints

- /books
- /publishers
- /reviews
- /authors
- /users
- /sessions
- /userbooks

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
- An account in [Cloudinary](https://cloudinary.com/), after create an account, you need fill the .env file with the following information:

```sh
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Installation

1. Clone the repo

```sh
git clone https://github.com/otaaaviio/library.git
```

2. Run the following command to build the project in first time

```sh
bin/setup.sh
```

3. Run the following command to start the project

```sh
docker compose up -d
```

## Development

### Factories

Is possible to run the following factories:
    
```sh
{ name: 'user', run: userFactory },
{ name: 'book', run: bookFactory },
{ name: 'author', run: authorFactory },
{ name: 'publisher', run: publisherFactory },
{ name: 'review', run: reviewFactory },
```
To run the factories, replacing [factory_name] with the desired factory and [quantity] with the desired quantity.
Run the following command:
```sh
docker exec -it library-node npm run factory [factory_name] [quantity]
```

## Built With

* [NestJS](https://nestjs.com) - The web framework used
* [Prisma](https://www.prisma.io) - ORM
* [PostgreSQL](https://www.postgresql.org) - Database
* [Docker](https://www.docker.com) - Containerization
* [Jest](https://jestjs.io) - Testing framework
* [Cloudinary](https://cloudinary.com) - Image storage

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