# **Ping – Backend Microservices Architecture**

![Ping Architecture](./assets/pingArchitecture.jpg)

Ping's backend is split into **three core microservices** to ensure modularity, high availability, and efficient resource allocation.

---

## **Subservices Overview**

### **1. User Service**

- **Role**: Core authentication and profile management.
- **Workflow**:
  - Validates user emails.
  - Generates 6-digit OTPs using **Redis** for TTL (5-min expiry).
  - Implements dynamic **rate-limiting** to prevent spam.
  - Publishes `send-otp` events to **RabbitMQ**.

### **2. Mail Service**

- **Role**: Asynchronous, fault-tolerant email delivery.
- **Workflow**:
  - Consumes events from the RabbitMQ `send-otp` queue.
  - Dispatches emails via **Nodemailer** using SMTP Providers.
  - Ensures no OTP mission is lost even if the mail server is temporarily down (Backpressure).

### **3. Chat Service**

- **Role**: Real-time messaging hub and persistent history.
- **Workflow**:
  - Manages persistent **Socket.IO** connections for live messaging.
  - Tracks user presence ("Online/Offline") globally.
  - Handles "Seen/Unseen" status updates in real-time.
  - Manages chat history persistence with **MongoDB**.
  - Implements logic for "Clear History" (Delete for me vs. Delete for both).
  - Securely stores images via **Cloudinary**.

---

## **Data Flow & Infrastructure**

1. **Redis**: Primary caching and TTL layer for security (OTP/Rate-limit).
2. **RabbitMQ**: The project's event bus, decoupling Auth and Mail logic.
3. **MongoDB**: Secure, horizontally scalable storage for users and chats.
4. **Cloudinary**: Object storage for media assets (images/avatars).

---

## **Tech Stack**
- **Node.js & TypeScript**
- **Express.js**
- **RabbitMQ** (Message Broker)
- **Redis** (Caching & TTL)
- **MongoDB** (Primary Database)
- **Cloudinary** (Image Storage)
- **Nodemailer** (Email Service)
- **Multer** (File Upload Middleware)
- **JWT** (JSON Web Tokens)

---

## **Directory Structure**

```bash
BACKEND/
├── user-service/  # AuthLogic, JWT, Redis rate-limiter, OTP publishing
├── mail-service/  # RabbitMQ consumers, Nodemailer integrations
└── chat-service/  # Socket.IO, Chat models, Message deletion logic
```

---

## **Environment Variables Setup**

Create a `.env` in each service's root based on the following templates:

### **User Service**

```env
PORT=
MONGO_URI=
REDIS_URL=

# RabbitMQ Configuration
RABBITMQ_URL=

# JWT Configuration
JWT_SECRET=
```

### **Mail Service**

```env
PORT=
REDIS_URL=

# RabbitMQ Configuration
RABBITMQ_URL=

# SMTP Configuration
EMAIL_USER=
EMAIL_PASSWORD=
```

### **Chat Service**

```env
PORT=
MONGO_URI=
USER_SERVICE_URL=

# JWT Configuration
JWT_SECRET=

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## **Deployment & Running Locally**

### **Option 1: Using Docker Compose (Recommended)**
The easiest way to run the backend and its dependencies is using the global `docker-compose` setup from the project root.

```bash
cd ..
docker-compose up --build -d
```
This automatically spins up Redis, RabbitMQ, MongoDB, and all 3 Node.js services.

### **Option 2: Running Services Manually**

1. **Dockerized Infrastructure**:
   ```bash
   docker run -d --name rabbitmq-container -p 5672:5672 -p 15672:15672 rabbitmq:3-management
   docker run -d --name redis-container -p 6379:6379 redis
   ```

2. **Run Each Service**:
   Open a separate terminal for each service:
   ```bash
   cd user-service && npm run dev
   cd mail-service && npm run dev
   cd chat-service && npm run dev
   ```

---

_Backend designed for speed and reliability._
