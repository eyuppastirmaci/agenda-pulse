# 🚀 AgendaPulse

AgendaPulse is a lightweight, self-hosted productivity tool for individuals and small teams to manage calendars, tasks, and notifications.  
It is built using a modular microservice architecture and modern frontend technologies.

The project aims to deliver useful GTD (Get Things Done) features with minimal overhead and great extensibility.

---

## 📋 Development Roadmap

- ✅ API Gateway and health checks  
- ✅ User authentication (signup/login) with JWT  
- ☐ Task management (CRUD + Kafka events)  
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
- Apache Kafka (planned)
- Spring Cloud Gateway

### 🎨 Frontend
- Next.js 14 (App Router)
- TypeScript, Tailwind CSS
- NextAuth.js

### 🚀 DevOps
- Docker, Docker Compose (planned)
- Jenkins (planned)
- Prometheus, Grafana (planned)

---

## 📋 Requirements

- Java 21+
- Node.js 18+
- PostgreSQL
- Docker & Docker Compose (planned)
- Apache Kafka (planned)

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

### 1. 🗄️ Install PostgreSQL

Install PostgreSQL on your computer or run it with Docker (recommended):

```bash
# Run PostgreSQL for auth-service database
docker run --name agenda-pg \
  -e POSTGRES_PASSWORD=YOUR_POSTGRES_PASSWORD \
  -e POSTGRES_DB=agenda_pulse_auth \
  -p 5432:5432 \
  -d postgres
```

---

### 2. 🔧 Start Backend Services

#### 🔐 Auth Service

**Option 1**
```bash
mvn spring-boot:run -pl apps/backend/auth-service
```

**Option 2**
```bash
cd apps/backend/auth-service
./mvnw spring-boot:run
```

#### 🌐 API Gateway

**Option 1**
```bash
mvn spring-boot:run -pl apps/backend/api-gateway
```

**Option 2**
```bash
cd apps/backend/api-gateway
./mvnw spring-boot:run
```

---

### 3. 🎨 Start Frontend

```bash
cd apps/frontend/webui
npm install
npm run dev
```

---

## 📄 License

[MIT License](LICENSE)

---

## 🤝 Contributions

Feel free to fork and contribute. PRs are welcome!
