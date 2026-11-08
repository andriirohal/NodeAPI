# 🧩 Backend API

A backend project built with **Node.js, Express, TypeScript, and PostgreSQL**, featuring separate authentication and shopping services, JWT-based authentication, role-based authorization, Prisma ORM, automated testing, and Docker Compose.

---

## ✨ Features

- Get all products
- Get product by ID
- Create a new product
- Update product by ID
- Delete product by ID
- Type-safe development with TypeScript
- JWT-based authentication
- Role-based access control (RBAC)
- Protected routes
- Database access with Prisma ORM
- PostgreSQL persistence
- Input validation and centralized error handling
- Automated tests across the entire project
- Dockerized backend and database
- Persistent PostgreSQL data with Docker volumes

---

## 🛠️ Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Jest
- Docker
- Docker Compose

---

## 📁 Project Structure

```text
├── auth/
│   ├── prisma/
│   ├── src/
│   └── tests/
│
├── shopping/
│   ├── prisma/
│   ├── src/
│   └── tests/
│
├── shared/
│   ├── prisma/
│   ├── src/
│   └── tests/
│
├── .dockerignore
├── .gitignore
├── compose.yaml
├── init.sql
└── README.md
```

---

## 🐳 Docker Setup

The application uses Docker Compose to run two independent backend services and a PostgreSQL database.

```text
Docker Compose
│
├── auth
│   └── Node.js + Express
│       └── port 8080
│
├── shopping
│   └── Node.js + Express
│       └── port 8081
│
└── db
    └── PostgreSQL
        └── port 5432
```

Both backend services communicate with PostgreSQL through their configured database connections.

PostgreSQL uses a Docker volume to persist data between container restarts.

```yaml
volumes:
  - postgres_data:/var/lib/postgresql
```

---

## 🚀 Getting Started

### Run with Docker

Build and start the containers:

```bash
docker compose up --build
```

The authentication service runs on port 8080, while the shopping service runs on port 8081.

Stop the containers:

```bash
docker compose down
```

Stop the containers and remove the database volume:

```bash
docker compose down -v
```

**Warning:** Removing the volume deletes the persisted PostgreSQL data.

### Environment Variables

Configure your `.env` file with the required database credentials and connection URLs.

```env
LOCAL_DATABASE_URL=postgres://andrii:password@localhost:5432/shopping_db
DOCKER_DATABASE_URL=postgres://andrii:password@db:5432/shopping_db

POSTGRES_USER=andrii
POSTGRES_PASSWORD=password
POSTGRES_DB=shopping_db

ACCESS_SECRET=a91f6c3d8e2b5074c5d9a1e7f3048b627e2c9f5a1d6b8034b8e4c2a7095f1d63a7c5e9b2d4f8016c3a8e5b7d9f20461e6b3c9a5d7f1028b4e9c2a6d1f5037
REFRESH_SECRET=d72a4f9c1b6e8035a8d2c7f4e9b10563c6f1a8d5e2b9047f3d9c6a1e5b8f2074b9e3d6c2a5f8017e4b9d2c6a1f5038d5c7e2a9b4f6013c8d5e7a2b9f4061
```

Use the Docker connection URL inside containers and the local connection URL when running the backend directly on your machine. Keep your actual `.env` file out of version control.

---

## 🗄️ Database

The project uses Prisma ORM to interact with PostgreSQL. The database schemas are defined in `auth/prisma/schema.prisma` and `shared/prisma/schema.prisma`.

The `users` model includes:

- `id` — UUID primary key generated automatically.
- `name` — required user name.
- `email` — required, unique email address.
- `password` — hashed password (8–100 characters).
- `role` — user role (`user` or `admin`), defaults to `user`.
- `created_at` — account creation timestamp set automatically.
- `refresh_token` — stored refresh token.

The `products` model includes:

- `id` — UUID primary key generated automatically.
- `name` — required, unique product name.
- `price` — product price greater than zero.
- `stock` — non-negative inventory quantity.
- `created_at` — creation timestamp set automatically.
- `updated_at` — timestamp automatically updated when a product is modified through Prisma.

Prisma provides type-safe database queries and generated client methods, reducing the need to write raw SQL for routine database operations.

---

## 🧪 Testing

The project includes automated tests covering the entire application, helping verify business logic, input validation, error handling, and API behavior.

Run the test suite:

```bash
npm run test
```

Runs Jest tests with coverage and detects open handles.

---

## 📄 Example Request

### Create Product

**POST** `/products`

Request body:

```json
{
  "name": "Laptop",
  "price": 1300,
  "stock": 10
}
```

Example response:

```json
{
  "id": "c7a2d9f4-8c1d-4a5a-8b67-1d2e3f4a5b6c",
  "name": "Laptop",
  "price": 1300,
  "stock": 10,
  "createdAt": "2026-10-26T17:44:09.071Z",
  "updatedAt": "2026-10-26T17:44:09.071Z"
}
```

## 🎯 Project Goals

This project demonstrates practical backend development skills, including REST API design, layered architecture, database modeling, ORM usage, automated testing, error handling, and containerized development.
