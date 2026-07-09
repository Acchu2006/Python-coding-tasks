# User Management: Full-Stack User Management System

A robust, production-ready User Management System designed for secure authentication, role-based administration, and seamless user data handling. Built with a modern React frontend and a high-performance FastAPI backend.

## 🚀 Features

### 🔐 Authentication & Security
- **JWT Authentication:** Secure, stateless token-based login and registration.
- **Role-Based Access Control (RBAC):** Distinct views and permissions for `Admin` and `User` roles.
- **Password Hashing:** Bcrypt implementation for secure credential storage.
- **Protected Routes:** Frontend routing guards to prevent unauthorized access.

### 🎨 Frontend (React + Vite)
- **Modern UI/UX:** Clean, responsive design built with Tailwind CSS.
- **Smooth Animations:** Custom fade-in and slide-up transitions, plus shimmer skeleton loaders for data fetching.
- **State Management:** Global authentication state using React Context and LocalStorage.
- **Optimized Routing:** Seamless navigation using React Router v6.

### ⚙️ Backend (FastAPI + MySQL)
- **High Performance:** Asynchronous Python backend using FastAPI.
- **Relational Database:** MySQL integration via SQLAlchemy ORM.
- **RESTful API:** Clean, documented endpoints with automatic Swagger UI (`/docs`).
- **CRUD Operations:** Full Create, Read, Update, Delete capabilities for user management.

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router, Axios, Lucide Icons |
| **Backend** | Python, FastAPI, Uvicorn, Pydantic |
| **Database** | MySQL 8.0, SQLAlchemy, PyMySQL |
| **Auth** | JWT (Python-Jose), Bcrypt |

## 🏗️ Project Structure

```text
userhub-fullstack/
├── backend/
│   ├── venv/
│   ├── main.py          # FastAPI app, models, and endpoints
│   ── requirements.txt
└── frontend/
    ├── node_modules/
    ├── src/
    │   ├── api.js       # Axios instance with JWT interceptors
    │   ├── App.jsx      # Main routing and auth state
    │   ├── Navbar.jsx   # Glassmorphism navigation
    │   ├── Login.jsx    # Auth page
    │   ├── Register.jsx # Auth page
    │   └── Dashboard.jsx# Admin/User dashboard with skeletons
    ├── index.html
    └── tailwind.config.js
