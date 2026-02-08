# **Ping – (Backend)**

This folder contains the backend microservices for **Ping**, a scalable chat application built using a **microservices architecture**.

## **High-Level Architecture** 

We have **two core backend services** involved here:

1. **User Service** → handles auth logic  
2. **Mail Service** → sends emails

Supporting systems:

* **Redis** → fast temporary storage  
* **RabbitMQ** → async communication (event bus)

 **Flow Diagram:**
<!-- <div align="center">

<img src="" alt="architecture" height="70">

</div> -->

                                ┌────────────┐
                                │  Frontend  │
                                │  (React)   │
                                └─────┬──────┘
                                      │  POST /login
                                      ▼
                            ┌────────────────────────┐
                            │     USER SERVICE       │
                            │                        │
                            │                        │
                            │  ┌──────────────┐      │
                            │  │ Controllers  │      │
                            │  │ loginUser()  │      │
                            │  └─────┬────────┘      │
                            │        │               │
                            │        ▼               │
                            │   ┌───────────┐        │
                            │   │  Redis    │        │
                            │   │ (OTP +    │        │
                            │   │ RateLimit)│        │
                            │   └───────────┘        │
                            │        │               │
                            │        ▼               │
                            │  ┌─────────────────┐   │
                            │  │ RabbitMQ        │   │
                            │  │ Queue: send-otp │   │
                            │  └─────────────────┘   │
                            └────────────────────────┘
                                        │
                                        ▼
                            ┌────────────────────────┐
                            │     MAIL SERVICE       │
                            │                        │
                            │                        │
                            │  ┌─────────────────┐   │
                            │  │   RabbitMQ      │   │
                            │  │   Consumer      │   │
                            │  └─────┬───────────┘   │
                            │        │               │
                            │        ▼               │
                            │  ┌─────────────────┐   │
                            │  │ Nodemailer /    │   │
                            │  │ SMTP Provider   │   │
                            │  └─────────────────┘   │
                            │        │               │
                            │        ▼               │
                            │     User Email         │
                            └────────────────────────┘


### **Step-by-Step Flow (Very Important)**

**1. User requests login:**

Frontend → POST /api/v1/login

`Body: { email }`

**2. User Service starts processing:**

 **Rate limiting (Redis)**

otp:ratelimit:user@gmail.com

* If exists → reject request  
* If not → continue

Why Redis?

* Ultra fast  
* Auto-expiry  
* Stateless service design

**3. OTP generation & storage (Redis again):**

otp:user@gmail.com → 123456(random 6 digit OTP) (expires in 5 min)

Redis is used because:

* OTP is temporary  
* No DB writes  
* Auto cleanup  
* High performance

**4. Event creation (User Service → RabbitMQ):**

User Service **does NOT send email**
Instead, it publishes an event in rabbitMQ:

            {

            "to": "user@gmail.com",

            "subject": "Your OTP Code",

            "body": "Your OTP code is 482931"

            }

Sent to:

RabbitMQ Queue → send-otp

 **Why RabbitMQ here?**

* Async processing  
* Loose coupling  
* Retry support  
* Backpressure handling

**5. Mail Service consumes the message**

Mail Service has a **consumer**:

send-otp queue → mail-service consumer

Flow:

1. Consume message  
2. Parse JSON  
3. Send email via SMTP / Nodemailer  
4. Acknowledge message

If mail service crashes:

* Message stays in queue  
* No OTP lost

This is **fault tolerant**.

**6. User Service responds immediately**

User doesn’t wait for email to send:

        {

        "message": "OTP has been sent to your email"

        }


**User Service Responsibilities:**

\- OTP-based login  
\- Rate limiting using Redis  
\- Temporary OTP storage  
\- Publishing OTP email events to RabbitMQ

**Mail Service Responsibilities:**

\- Consume messages from RabbitMQ  
\- Send emails using SMTP / Nodemailer  
\- Handle retries and failures independently

---

**Tech Stack:**

- Node.js  
- Express.js  
- TypeScript  
- RabbitMQ  
- Redis  
- Nodemailer
- Cloudinary
---

## **Environment Variables:**

### *User Service (\`.env\`)*

PORT=  
MONGO\_URI=  
REDIS\_URL=

// RabbitMQ Configuration  
RABBITMQ\_HOST=  
RABBITMQ\_PORT=  
RABBITMQ\_USER=  
RABBITMQ\_PASSWORD=

### *Mail Service (\`.env\`)*

PORT=  
REDIS\_URL=

// RabbitMQ Configuration  
RABBITMQ\_HOST=  
RABBITMQ\_PORT=  
RABBITMQ\_USER=  
RABBITMQ\_PASSWORD=

// SMTP Configuration  
EMAIL\_USER=  
EMAIL\_PASSWORD=

---

## **Running the Services:**

**1. Start RabbitMQ**  
```bash
docker run -d \
--hostname rabbitmq-host \
--name rabbitmq-container \
-e RABBITMQ_DEFAULT_USER=admin \
-e RABBITMQ_DEFAULT_PASS=admin123 \
-p 5672:5672 \
-p 15672:15672 \ rabbitmq:3-management
```

- RabbitMQ UI:  
```bash
 [http://localhost:15672](http://localhost:15672/)
 ```


**2. Start User Service**

cd user-service  
npm install  
npm run dev

**3. Start Mail Service**

cd mail-service  
npm install  
npm run dev
