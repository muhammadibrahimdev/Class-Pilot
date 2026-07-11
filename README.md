# ClassPilot 🎓

> A multi-tenant School Management SaaS platform built with the MERN stack. Designed for real schools — manage admins, teachers, students, attendance, fees, and results from one unified hub.



![ClassPilot Dashboard](https://i.ibb.co/FpHCzxm/Screenshot-2026-07-11-174046.png)


![ClassPilot Dashboard](https://i.ibb.co/DhTg42r/Screenshot-2026-07-11-173947.png)


![ClassPilot Dashboard](https://i.ibb.co/HTF04CGC/Screenshot-2026-07-11-172816.png)

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| Frontend | _coming soon_ |
| Backend API | _coming soon_ |

**Demo Credentials:**

| Role | Email | Password |
|---|---|---|
| Super Admin |  |
| School Admin | test@gmail.com | 123456 |
| Teacher |  |
| Parent | |

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Database Design](#database-design)
- [API Documentation](#api-documentation)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)

---

## Overview

ClassPilot is a production-grade School Management SaaS that supports multiple schools on a single platform. Each school operates as an isolated tenant with its own admin, teachers, students, and data.

The platform supports 4 user roles with different levels of access:

| Role | Responsibilities |
|---|---|
| **Super Admin** | Approves schools, manages subscriptions, monitors platform |
| **School Admin** | Manages teachers, students, classes, fees, attendance reports |
| **Teacher** | Takes attendance, enters results, views assigned classes |
| **Parent** | Views child's attendance, results, and fee status |

---

## ✨ Features

### ✅ Phase 1 — Foundation & Auth (Complete)
- JWT authentication with access token + refresh token
- Role-based access control (4 roles)
- bcrypt password hashing
- Protected routes per role
- School registration with admin account creation

### ✅ Phase 2 — Core Features (In Progress)
- Super Admin dashboard — approve/reject school requests
- School Admin dashboard — operational overview
- Teacher management — add, edit, delete, list with search & pagination
- Class management — create classes with subjects and assigned teachers
- Student management — enroll students with parent linking

### 🔄 Phase 3 — Fees, Results & Notifications (Planned)
- Monthly fee tracking per student
- Result entry by teachers with PDF report cards (PDFKit)
- Real-time notifications via Socket.io
- Email alerts via Nodemailer
- Parent portal — attendance, fees, results in one view

### 🔄 Phase 4 — Subscription & Deployment (Planned)
- Stripe subscription — Basic (200 students) / Pro (unlimited)
- Rate limiting & security hardening
- Deployment on Vercel + Render + MongoDB Atlas

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication tokens |
| bcrypt | Password hashing |
| Socket.io | Real-time notifications |
| Nodemailer | Email alerts |
| PDFKit | Result card generation |
| Cloudinary | Image uploads |
| Stripe | Subscription payments |
| Helmet + CORS | Security |
| express-validator | Input validation |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Redux Toolkit | Global state management |
| React Router v7 | Client-side routing |
| Tailwind CSS v4 | Styling |
| Axios | HTTP client with interceptors |
| GSAP | Animations |
| Lucide React | Icons |
| Space Grotesk + Inter | Typography |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│         React + Redux + Tailwind CSS             │
│              (Vercel)                            │
└─────────────────┬───────────────────────────────┘
                  │ HTTPS + JWT
┌─────────────────▼───────────────────────────────┐
│                 Backend                          │
│            Node.js + Express                     │
│              (Render)                            │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │   Auth   │  │  Routes  │  │  Middleware   │  │
│  │  Module  │  │  /api/*  │  │  protect +   │  │
│  └──────────┘  └──────────┘  │  authorize   │  │
│                               └──────────────┘  │
└─────────────────┬───────────────────────────────┘
                  │ Mongoose
┌─────────────────▼───────────────────────────────┐
│              MongoDB Atlas                       │
│                                                  │
│  Users │ Schools │ Classes │ Students │ Teachers │
│  Attendance │ Fees │ Results │ Notifications     │
└─────────────────────────────────────────────────┘
```

---

## 🗄 Database Design

### Core Collections

```
User          → Authentication & identity for all roles
School        → School profile, plan, approval status
Teacher       → Teaching profile linked to User
Student       → Academic profile linked to User
Class         → Grade + section with subjects & teachers
Attendance    → Daily per-student attendance records
Fee           → Monthly fee status per student
Result        → Subject marks per student per exam
Notification  → Real-time alerts per user
```

### Key Design Decisions

**Extended Profile Pattern** — User handles auth only. Role-specific data lives in separate collections (Teacher, Student) linked via `userId`. This avoids bloating the User collection and keeps queries clean.

**MongoDB Transactions** — Used when creating Teacher or Student (two documents must succeed or fail together: User + Teacher/Student profile).

**Multi-tenant Isolation** — Every document that belongs to a school carries `schoolId`. All queries are automatically scoped to `req.user.schoolId` from the auth middleware.

**Compound Index on Student** — `{ rollNumber, schoolId }` ensures roll numbers are unique per school, not globally.

---

## 📡 API Documentation

### Auth Routes `/api/auth`
```
POST   /register          → Register school admin + create school
POST   /login             → Login (any role)
POST   /refresh-token     → Refresh access token
POST   /logout            → Logout (clears refresh token)
GET    /me                → Get logged-in user profile
```

### School Routes `/api/schools`
```
GET    /stats             → Platform stats (superadmin)
GET    /pending           → Pending school requests (superadmin)
GET    /                  → All approved schools (superadmin)
GET    /:id               → Single school details
PATCH  /:id/approve       → Approve school (superadmin)
DELETE /:id/reject        → Reject school (superadmin)
```

### Class Routes `/api/classes`
```
POST   /class             → Create class (schooladmin)
GET    /classes           → All classes with pagination & search
GET    /class/:id         → Single class with populated teachers
PUT    /class/:id         → Update class
POST   /class/:id/subjects         → Add subject to class
DELETE /class/:id/subjects/:subId  → Remove subject
DELETE /class/:id                  → Delete class
```

### User Routes `/api/users`
```
POST   /teacher           → Add teacher (schooladmin)
GET    /teachers          → All teachers with pagination & search
PUT    /teacher/:id       → Edit teacher
DELETE /teacher/:id       → Delete teacher
POST   /student           → Add student + parent account
GET    /students          → All students with pagination & search
PUT    /student/:id       → Edit student
DELETE /student/:id       → Delete student
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB replica set for transactions)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/classpilot.git
cd classpilot
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your environment variables
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Seed Super Admin
```bash
cd backend
node scripts/seedSuperAdmin.js
```

---

## 🔐 Environment Variables

### Backend `.env`
```env
# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/classpilot

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Server
PORT=5000
CLIENT_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📁 Project Structure

```
classpilot/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── schoolController.js
│   │   ├── classController.js
│   │   ├── userController.js
│   │   ├── attendanceController.js
│   │   ├── feesController.js
│   │   ├── resultController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validate.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── schoolModel.js
│   │   ├── teacherModel.js
│   │   ├── studentModel.js
│   │   ├── classModel.js
│   │   ├── attendanceModel.js
│   │   ├── feesModel.js
│   │   ├── resultModel.js
│   │   └── notificationModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── schoolRoutes.js
│   │   ├── classRoutes.js
│   │   ├── userRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── feesRoutes.js
│   │   ├── resultRoutes.js
│   │   └── notificationRoutes.js
│   ├── services/
│   │   ├── emailService.js
│   │   └── pdfService.js
│   ├── utils/
│   │   ├── apiResponse.js
│   │   └── generateToken.js
│   ├── validators/
│   │   └── authValidator.js
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── forms/
│   │   │   │   ├── AddTeacherForm.jsx
│   │   │   │   ├── AddStudentForm.jsx
│   │   │   │   └── AddClassForm.jsx
│   │   │   ├── layout/
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Topbar.jsx
│   │   │   └── ui/
│   │   │       ├── Avatar.jsx
│   │   │       ├── Badge.jsx
│   │   │       ├── Button.jsx
│   │   │       ├── DataTable.jsx
│   │   │       ├── IconButton.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── Logo.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── StatCard.jsx
│   │   │       └── StepDots.jsx
│   │   ├── config/
│   │   │   ├── icons.js
│   │   │   └── navigation.js
│   │   ├── hooks/
│   │   │   ├── useTeachers.js
│   │   │   └── useDebounce.js
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── superadmin/
│   │   │   │   └── Dashboard.jsx
│   │   │   └── schooladmin/
│   │   │       ├── Dashboard.jsx
│   │   │       └── Teachers.jsx
│   │   ├── store/
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   │       └── authSlice.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## 🗺 Roadmap

- [x] Phase 1 — Authentication & Foundation
- [x] Phase 2 — School, Teacher, Class, Student Management (in progress)
- [ ] Phase 3 — Fees, Results, Notifications, Parent Portal
- [ ] Phase 4 — Stripe Subscriptions, Deployment, PDF Reports

---

## 👨‍💻 Author

Built by **[Muhammad Ibrahim]**
- GitHub: [muhammadibrahimdev](https://github.com/muhammadibrahimdev)
- LinkedIn: [muhammad-ibrahim.dev](https://linkedin.com/in/muhammad-ibrahim.dev)
- Portfolio: [muhammadibrahim.vercel.app](https://muhammadibrahimdev.vercel.app/)
---

## 📄 License

This project is licensed under the MIT License.
