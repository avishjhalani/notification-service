# 🔔 Notification Service API

A production-ready REST API for async email notification delivery built with **NestJS**, **PostgreSQL**, **Redis**, and **BullMQ**.

## 🌐 Live API
`https://notification-service-production-d39f.up.railway.app`

## ✨ Features
- 🔐 JWT Authentication — secure register/login
- ⚡ Async email delivery via Redis job queues (BullMQ)
- 🔁 Automatic retry with exponential backoff (3 attempts: 5s → 10s → 20s)
- 🗃️ Delivery status tracking — pending → sent / failed
- 🚦 Per-user rate limiting — 5 requests/minute
- 🐳 Dockerised local development

## 🏗️ Architecture

```
Client
  ↓
POST /notifications/send
  ↓
JWT Guard (auth check)
  ↓
Save to PostgreSQL (status: pending)
  ↓
Add job to Redis Queue (BullMQ)
  ↓ (returns ~300ms response to client)

Background Worker
  ↓
Pick up job from queue
  ↓
Send email via Resend API
  ↓
Update PostgreSQL (status: sent / failed)
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | NestJS (TypeScript) |
| Database | PostgreSQL + Prisma ORM |
| Queue | Redis + BullMQ |
| Auth | JWT |
| Email | Resend API |
| Deploy | Railway |
| Local Dev | Docker Compose |

## 📚 API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /auth/register | Register new user | No |
| POST | /auth/login | Login, returns JWT | No |

### Notifications
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /notifications/send | Queue a notification | Yes |
| GET | /notifications | List all notifications | Yes |
| GET | /health | Health check | No |

## 📦 Request Examples

### Register
```json
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login
```json
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Send Notification
```json
POST /notifications/send
Authorization: Bearer <token>

{
  "to": "recipient@example.com",
  "subject": "Hello",
  "body": "This is a notification"
}
```

### Response
```json
{
  "id": 1,
  "status": "pending",
  "message": "Notification queued successfully"
}
```

## ⚙️ How It Works

1. Client calls `POST /notifications/send` with a JWT token
2. API verifies JWT, saves notification to PostgreSQL as `pending`
3. Job added to Redis queue — API returns response in ~300ms
4. Background worker picks up job, sends email via Resend
5. Worker updates status to `sent` or `failed` in PostgreSQL
6. If sending fails, BullMQ retries automatically up to 3 times

## 🔁 Retry Logic

Failed email deliveries are retried with exponential backoff:
- Attempt 1 fails → wait 5 seconds → retry
- Attempt 2 fails → wait 10 seconds → retry
- Attempt 3 fails → wait 20 seconds → mark as failed

## 🚦 Rate Limiting

`POST /notifications/send` is limited to **5 requests per minute** per user.
Exceeding this returns `429 Too Many Requests`.

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- Docker Desktop

### Setup

```bash
# Clone
git clone https://github.com/avishjhalani/notification-service.git
cd notification-service

# Install
npm install

# Copy env and fill in values
cp .env.example .env

# Start PostgreSQL and Redis
docker-compose up -d

# Run migrations
npx prisma migrate dev

# Start server
npm run start:dev
```

Server runs at `http://localhost:4001`

## 🌍 Environment Variables

See `.env.example` for all required variables:

```bash
DATABASE_URL=
REDIS_HOST=
REDIS_PORT=
JWT_SECRET=
RESEND_API_KEY=
MAIL_FROM=
```
