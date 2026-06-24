# 🔔 Notification Service API

A production-ready, scalable notification microservice built with **NestJS**, **PostgreSQL**, **Redis**, **BullMQ**, and **Prisma** — containerized with Docker.

Supports multi-channel notifications (Email, SMS, In-App) with reliable async delivery via message queues, JWT-based authentication, and retry logic.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register/login flow with token-based access
- 📬 **Multi-Channel Delivery** — Email, SMS, and In-App notification support
- ⚡ **Async Queue Processing** — BullMQ + Redis for reliable background job handling
- 🔁 **Retry & Failure Handling** — Automatic retry with exponential backoff
- 🗃️ **Prisma ORM** — Type-safe database access with PostgreSQL
- 🐳 **Dockerized** — Fully containerized for consistent local and production environments
- 📄 **Swagger Docs** — Auto-generated API documentation at `/api/docs`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS (TypeScript) |
| Database | PostgreSQL |
| ORM | Prisma |
| Queue | BullMQ |
| Cache / Queue Broker | Redis |
| Auth | JWT (jsonwebtoken) |
| Containerization | Docker + Docker Compose |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) & Docker Compose
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/notification-service-api.git
cd notification-service-api
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# App
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/notification_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your_app_password
```

### 3. Start with Docker (Recommended)

```bash
docker-compose up -d
```

This starts PostgreSQL, Redis, and the API server.

### 4. Run Database Migrations

```bash
npx prisma migrate dev
```

### 5. Start the Dev Server (without Docker)

```bash
npm install
npm run start:dev
```

The API will be available at `http://localhost:3000`.

---

## 📚 API Endpoints

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive JWT token |

### Notifications

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/notifications/send` | Send a notification (queued) |
| `GET` | `/notifications` | Get all notifications for the user |
| `GET` | `/notifications/:id` | Get a specific notification |
| `PATCH` | `/notifications/:id/read` | Mark notification as read |

> All `/notifications` routes require `Authorization: Bearer <token>` header.

---

## 📦 Request & Response Examples

### Register

```http
POST /auth/register
Content-Type: application/json

{
  "name": "Avish Jhalani",
  "email": "avish@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": "uuid-here"
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "avish@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOi..."
}
```

### Send Notification

```http
POST /notifications/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "uuid-of-recipient",
  "type": "EMAIL",
  "title": "Welcome!",
  "message": "Thanks for joining our platform.",
  "metadata": {
    "priority": "HIGH"
  }
}
```

**Response:**
```json
{
  "message": "Notification queued successfully",
  "jobId": "job-id-123"
}
```

---

## 🏗️ Project Structure

```
src/
├── auth/               # Authentication module (register, login, JWT guard)
├── notifications/      # Notification module (CRUD, queue producer)
├── queues/             # BullMQ workers and processors
├── prisma/             # Prisma service and schema
├── common/             # Guards, decorators, interceptors, filters
└── main.ts             # App entry point

prisma/
└── schema.prisma       # Database schema

docker-compose.yml      # Docker services config
.env.example            # Environment variable template
```

---

## 🔄 Queue Architecture

Notifications are dispatched asynchronously using **BullMQ**:

```
Client Request
     │
     ▼
NestJS Controller
     │
     ▼
BullMQ Producer ──► Redis Queue
                          │
                          ▼
                   BullMQ Worker
                          │
                    ┌─────┴──────┐
                    ▼            ▼
                 Email        In-App
                Provider      DB Write
```

Failed jobs are automatically retried up to **3 times** with exponential backoff before being moved to the dead-letter queue.

---

## 🧪 Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

---

## 📖 Swagger Documentation

Interactive API docs are available at:

```
http://localhost:3000/api/docs
```

---

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down

# Rebuild containers
docker-compose up -d --build
```

---

## 🔮 Roadmap

- [ ] WebSocket support for real-time in-app notifications
- [ ] Push notification channel (FCM)
- [ ] Notification preferences per user
- [ ] Rate limiting per user/channel
- [ ] Admin dashboard for monitoring queues
- [ ] Publish as npm package

---

## 👤 Author

**Avish Jhalani**
- LinkedIn: [linkedin.com/in/avishjhalani](https://linkedin.com/in/avishjhalani)
- GitHub: [@your-username](https://github.com/avishjhalani)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
