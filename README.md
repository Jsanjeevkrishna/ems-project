# ⚡ TaskFlow — Project & Team Management System

A full-stack web application for **project management** with **role-based access control**, built with React + Node.js + MongoDB. Designed for team collaboration with Admin and Member roles.

---

## 🚀 Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | `https://taskflow-frontend.railway.app` |
| **Backend API** | `https://taskflow-backend.railway.app/api` |

> 🔑 **Demo credentials:**
> - **Admin (HR):** `admin@taskflow.com` / `admin123`
> - **Manager:** `manager@taskflow.com` / `manager123`
> - **Member:** `member@taskflow.com` / `member123`

---

## 🌟 Features

### Authentication
- JWT-based login & signup
- Role-based access: **Admin**, **Manager**, **Member (Employee)**
- First-login password creation flow

### Project Management (Admin)
- ✅ Create, update, delete projects
- ✅ Set status (Active / On-Hold / Completed / Cancelled)
- ✅ Set priority (Low / Medium / High)
- ✅ Add/remove team members from projects

### Task Management
- ✅ Create tasks within projects (Admin/Manager)
- ✅ Assign tasks to team members
- ✅ Set due dates, priority, description
- ✅ Update task status: **Pending → In Progress → Completed**
- ✅ Employees update their own task status

### Dashboard
- ✅ Total projects (active, completed)
- ✅ Task stats (total, pending, in-progress, completed)
- ✅ **Overdue tasks** highlighted in red
- ✅ Progress bar per project

### Additional
- 📊 HR/Admin: Payroll, Attendance, Leaves, Performance tracking
- 💬 Real-time Team Chat (Socket.IO)
- 🔔 Notifications system
- 🔍 Employee search

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, React Router v7 |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **Real-time** | Socket.IO |
| **Deployment** | Railway |

---

## 📁 Project Structure

```
ems/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/
│   │   ├── auth/        # Login, Signup, SetPassword
│   │   ├── project/     # Project CRUD + tasks + members
│   │   ├── hr/          # HR management controllers
│   │   ├── manager/     # Manager task/dashboard
│   │   ├── employee/    # Employee task/profile
│   │   └── common/      # Chat, Notifications
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification
│   │   └── roleMiddleware.js   # RBAC guards
│   ├── models/
│   │   ├── User.js      # Users with roles
│   │   ├── Project.js   # Projects with members
│   │   ├── Task.js      # Tasks with projectId
│   │   └── ...
│   ├── routes/          # REST API routes
│   ├── server.js
│   └── railway.toml
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── auth/        # Login, Signup
    │   │   ├── projects/    # ProjectList, ProjectDetail, CreateProject
    │   │   ├── hr/          # Admin dashboard
    │   │   ├── manager/     # Manager dashboard
    │   │   └── employee/    # Employee dashboard
    │   ├── routes/          # AppRoutes, Protected routes
    │   └── utils/           # axiosInstance, auth helpers
    └── railway.toml
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new member |
| POST | `/api/auth/login` | Login (all roles) |
| POST | `/api/auth/set-password` | Set password (first login) |

### Projects
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/projects/stats` | All | Dashboard stats |
| GET | `/api/projects` | All | List projects |
| POST | `/api/projects` | Admin | Create project |
| GET | `/api/projects/:id` | Member | Get project |
| PUT | `/api/projects/:id` | Admin | Update project |
| DELETE | `/api/projects/:id` | Admin | Delete project |
| POST | `/api/projects/:id/members` | Admin | Add member |
| DELETE | `/api/projects/:id/members/:uid` | Admin | Remove member |
| GET | `/api/projects/:id/tasks` | Member | Get project tasks |
| POST | `/api/projects/:id/tasks` | Admin/Manager | Create task |

### Tasks
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/manager/tasks` | Manager | My team tasks |
| POST | `/api/manager/tasks/create` | Manager | Create task |
| PATCH | `/api/manager/tasks/:id/status` | Manager | Update status |
| GET | `/api/employee/tasks` | Employee | My tasks |
| PATCH | `/api/employee/tasks/:id` | Employee | Update status |

---

## 🔐 Role-Based Access Control

| Feature | Admin | Manager | Member |
|---------|-------|---------|--------|
| Create project | ✅ | ❌ | ❌ |
| View all projects | ✅ | Own | Own |
| Add/remove members | ✅ | ❌ | ❌ |
| Create tasks | ✅ | ✅ | ❌ |
| Assign tasks | ✅ | ✅ | ❌ |
| Update task status | ✅ | ✅ | Own tasks |
| Manage payroll | ✅ | ❌ | ❌ |
| View own tasks | ✅ | ✅ | ✅ |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with VITE_API_URL=http://localhost:5000/api
npm run dev
```

---

## 🚢 Railway Deployment

### Step 1 — MongoDB
Use [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier) and get your connection string.

### Step 2 — Deploy Backend
1. Push to GitHub
2. New Railway project → **Deploy from GitHub**
3. Select `backend/` as **Root Directory**
4. Add environment variables:
   ```
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your_secret_key
   CLIENT_URL=https://your-frontend.railway.app
   ```
5. Railway auto-deploys — note your backend URL

### Step 3 — Deploy Frontend
1. Add new service in the same project
2. Select `frontend/` as **Root Directory**
3. Add environment variables:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
4. Railway builds Vite and serves the dist

---

## 📊 Database Models

### User
```json
{ "name": "string", "email": "string", "password": "hashed",
  "role": "admin|manager|employee", "managerId": "ObjectId" }
```

### Project
```json
{ "title": "string", "description": "string",
  "status": "active|completed|on-hold|cancelled",
  "priority": "low|medium|high",
  "adminId": "ObjectId", "members": ["ObjectId"],
  "startDate": "Date", "endDate": "Date" }
```

### Task
```json
{ "title": "string", "description": "string",
  "status": "pending|in-progress|completed",
  "priority": "low|medium|high",
  "projectId": "ObjectId", "employeeId": "ObjectId",
  "managerId": "ObjectId", "dueDate": "Date" }
```

---

## 👤 Author

**Sanjeev Krishna J**
- GitHub: [Jsanjeevkrishna](https://github.com/Jsanjeevkrishna)
- Built for technical assessment submission

---

## 📄 License

MIT
