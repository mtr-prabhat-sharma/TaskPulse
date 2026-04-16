# 🚀 TaskPulse - Task Management System

A full-stack task management application built with **Node.js, Express, Prisma, PostgreSQL, and React**.

---

# 📌 Features

## 🔐 Authentication

* Login with JWT
* Role-based access (Manager / Employee)

## 📋 Task Management

* Manager can create tasks
* Assign tasks to employees
* Task lifecycle:

  * PENDING → IN_PROGRESS → COMPLETED → APPROVED / RETURNED

## ⏱ Time Tracking

* Start task → creates time log
* Complete task → closes time log

## 💬 Comments

* Add comments on tasks
* Auto comment on task return

## 🔔 Notifications

* In-app notifications (basic implementation)

## 📲 WhatsApp Integration (Msg91)

* Sends message on:

  * Task Assigned
  * Task Completed
* Uses environment variables for API key

> Note: WhatsApp delivery may require sandbox/number setup

## 📊 Kanban Board

* View tasks in:

  * Pending
  * In Progress
  * Completed

---

# 🛠 Tech Stack

### Backend

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL

### Frontend

* React (Vite)
* Axios

### Other

* Docker (optional)
* Msg91 (WhatsApp API)

---

# 📂 Project Structure

```
TaskPulse/
│
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   ├── services/
│   │   ├── config/
│   │   └── index.ts
│   ├── prisma/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── services/
│   └── package.json
│
└── README.md
```

---

# ⚙️ Setup Instructions

## 1️⃣ Clone the repository

```
git clone <your-repo-url>
cd TaskPulse
```

---

## 2️⃣ Backend Setup

```
cd backend
npm install
```

### Create `.env`

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskpulse"

MSG91_API_KEY=your_api_key
MSG91_WHATSAPP_NUMBER=your_number
JWT_SECRET=secret
```

---

## 3️⃣ Run Database

Make sure PostgreSQL is running (or Docker container)

---

## 4️⃣ Run Prisma

```
npx prisma db push
npx prisma generate
```

---

## 5️⃣ Seed Data (optional)

Add users manually via:

```
npx prisma studio
```

---

## 6️⃣ Start Backend

```
npm run dev
```

---

## 7️⃣ Frontend Setup

```
cd ../frontend
npm install
npm run dev
```

---

# 🔑 Test Credentials

## Manager

```
email: manager1@test.com
password: password123
```

## Employee

```
email: employee1@test.com
password: password123
```

---

# 🌐 API Endpoints

| Method | Endpoint            | Description   |
| ------ | ------------------- | ------------- |
| POST   | /auth/login         | Login         |
| GET    | /tasks              | Get all tasks |
| POST   | /tasks              | Create task   |
| PATCH  | /tasks/:id/start    | Start task    |
| PATCH  | /tasks/:id/complete | Complete task |
| PATCH  | /tasks/:id/approve  | Approve task  |
| PATCH  | /tasks/:id/return   | Return task   |

---

# 🐳 Docker (Optional)

```
docker run -d \
  --name taskpulse-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=taskpulse \
  -p 5432:5432 \
  postgres:15
```

---

# ⚠️ Known Limitations

* WhatsApp integration uses sandbox (may not deliver messages)
* Timer is basic (no pause/resume)
* No drag-and-drop in Kanban

---

# 👨‍💻 Author

Prabhat Sharma

---

# ⭐ Notes for Evaluator

* Clean architecture with modular structure
* Prisma ORM used for type safety
* WhatsApp integration implemented via Msg91
* Role-based task lifecycle enforced
* UI built with simplicity and clarity in mind

---
