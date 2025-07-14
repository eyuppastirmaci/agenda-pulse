# AgendaPulse

AgendaPulse is a lightweight, self-hosted productivity tool for individuals and small teams to manage calendars, tasks, and notifications.

It is built using a modular microservice architecture and modern frontend technologies.

---

## 📋 Development Roadmap

- ✅ API Gateway and health checks
- ✅ User authentication (signup/login) with JWT
- ✅ Task management (CRUD + Kafka events)
- ☐ Calendar event creation & reminders
- ☐ Notification delivery system (email, WebSocket, push)
- ☐ Admin dashboard and user profile
- ☐ Docker Compose + Jenkins CI/CD pipeline

---

## 🛠️ Tech Stack

### 🔧 Backend

- Java 21, Spring Boot 3.5
- Spring Security, JPA, Actuator
- PostgreSQL
- Apache Kafka
- Spring Cloud Gateway

### 🎨 Frontend

- Next.js 14 (App Router)
- TypeScript, Tailwind CSS
- NextAuth.js

### 🚀 DevOps

- Docker, Docker Compose
- Jenkins (planned)
- Prometheus, Grafana (planned)

---

## 📋 Requirements

- Java 21+
- Node.js 18+
- PostgreSQL
- Docker & Docker Compose
- Apache Kafka

---

## ⚙️ Configuration Setup

### Backend `application.yml`

Before running the backend services, copy and configure the example application files:

#### 🌐 API Gateway Configuration

```bash
# Navigate to api gateway directory
cd apps/backend/api-gateway

# Copy example configuration
cp src/main/resources/application.example.yml src/main/resources/application.yml
```

#### 🔐 Auth Service Configuration

```bash
# Navigate to auth service directory
cd apps/backend/auth-service

# Copy example configuration
cp src/main/resources/application.example.yml src/main/resources/application.yml
```

#### 📅 Task Service Configuration

```bash
# Navigate to task service directory
cd apps/backend/task-service

# Copy example configuration
cp src/main/resources/application.example.yml src/main/resources/application.yml
```

---

### 🎨 Frontend `.env` configuration

Before running the frontend, create your local `.env` file:

```bash
# Navigate to frontend directory
cd apps/frontend/web-ui

# Copy example environment file
cp .env.example .env.local

# Edit with your local settings
```

---

## 🚀 Getting Started

### 1. 💴 Start All Services with Docker Compose

```bash
# Start PostgreSQL, Kafka, Zookeeper, and Kafka UI
cd path/to/project/root

docker-compose up -d
```

### 2. 🔧 Start Backend Services

#### 🔐 Auth Service

```bash
cd apps/backend/auth-service
./mvnw spring-boot:run
```

#### 🌐 API Gateway

```bash
cd apps/backend/api-gateway
./mvnw spring-boot:run
```

#### 📅 Task Service

```bash
cd apps/backend/task-service
./mvnw spring-boot:run
```

---

### 3. 🎨 Start Frontend

```bash
cd apps/frontend/web-ui
npm install
npm run dev
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors & Contributors

- **Eyup Pastirmaci** - [@eyuppastirmaci](https://github.com/eyuppastirmaci)

---

## 🤝 Contributions

Feel free to fork and contribute. PRs are welcome!

