# 🚀 TaskFlow — Employee & Project Management System

A full-stack, role-based Employee Management System with integrated Project Management module, real-time chat, leave tracking, and task assignment.

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| **Frontend (Live App)** | https://ems-project-1-4azz.onrender.com |
| **Backend API** | https://ems-project-rh7z.onrender.com/api |
| **GitHub Repository** | https://github.com/Jsanjeevkrishna/ems-project |

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| **Admin / HR** | admin@taskflow.com | admin123 |
| **Manager** | manager@taskflow.com | manager123 |
| **Employee** | employee@taskflow.com | employee123 |

---

## ✨ Features

### Role-Based Access Control (RBAC)
- **Admin/HR**: Full access — manage employees, projects, leaves, attendance
- **Manager**: Create & manage projects, assign tasks, approve/reject leaves
- **Employee**: View assigned tasks, apply for leaves, join projects

### Project Management Module
- Create, edit, delete projects with status tracking (active / on-hold / completed)
- Priority levels: Low / Medium / High
- Add/remove team members per project
- Task creation within projects with due dates and priority
- Progress bar showing task completion percentage
- Stat cards: Total Tasks, Completed, In Progress, Pending

### Task Management
- Assign tasks to employees with due dates
- Track status: Pending → In Progress → Completed
- Filter tasks by status and project

### Employee Management
- HR can add/edit/delete employees
- Profile management with department and role info

### Leave Management
- Employee leave applications
- Manager/HR approval workflow

### Attendance Tracking
- Mark daily attendance
- View attendance records

### Real-Time Team Chat
- Socket.io powered group chat rooms
- Role-separated chat rooms

### Authentication
- JWT-based login/logout
- Self-registration (signup) for new members
- Password hashing with bcryptjs

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Axios |
| **Backend** | Node.js, Express 5, Socket.io |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Styling** | Vanilla CSS, Glassmorphism design |
| **Deployment** | Render (Frontend + Backend) |

---

## 📁 Project Structure

```
ems-project/
├── backend/
│   ├── controllers/
│   │   ├── auth/          # Login, signup handlers
│   │   ├── project/       # Project CRUD
│   │   ├── task/          # Task management
│   │   ├── leave/         # Leave workflows
│   │   └── attendance/    # Attendance tracking
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express route definitions
│   ├── seed/              # Demo data seed script
│   └── server.js          # Express + Socket.io server
└── frontend/
    └── src/
        ├── pages/
        │   ├── auth/       # Login, Signup
        │   ├── hr/         # HR/Admin dashboard
        │   ├── manager/    # Manager dashboard
        │   ├── employee/   # Employee dashboard
        │   └── projects/   # Project management pages
        ├── routes/         # React Router configuration
        └── utils/          # Axios instance
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Backend
```bash
cd backend
npm install
# Create .env file:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/ems_db
# JWT_SECRET=your_secret_key
# CLIENT_URL=http://localhost:5173
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Create .env file:
# VITE_API_URL=http://localhost:5000/api
npm run dev
```

### Seed Demo Data
```bash
cd backend
npm run seed
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/login | Login user |
| POST | /api/auth/signup | Register new user |

### Projects
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/projects | List all projects |
| POST | /api/projects | Create project (Admin) |
| GET | /api/projects/:id | Get project details |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |
| POST | /api/projects/:id/members | Add member |
| DELETE | /api/projects/:id/members/:uid | Remove member |

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/tasks | List tasks |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

---

## 🚀 Deployment

Both services are deployed on **Render** (free tier):

### Backend Environment Variables (Render)
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
CLIENT_URL=https://ems-project-1-4azz.onrender.com
```

### Frontend Environment Variables (Render)
```
VITE_API_URL=https://ems-project-rh7z.onrender.com/api
```

> **Note**: Free Render instances spin down after 15 minutes of inactivity. First request may take ~50 seconds to wake up.

---

## 👤 Author

**J. Sanjeev Krishna**  
GitHub: [@Jsanjeevkrishna](https://github.com/Jsanjeevkrishna)
