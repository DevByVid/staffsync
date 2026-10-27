# StaffSync — Modern Human Resource Management Solution

A full-stack HRM web application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It gives HR, Managers and Employees their own role-based dashboards to manage employees, leaves, attendance, announcements and training programs.

**Live Demo:** `https://staffsync-cnc55157u-vidushii.vercel.app`  
**Backend API:** `https://staffsync-api-tqrr.onrender.com`

> The backend runs on Render's free tier, which sleeps after 15 minutes of inactivity. The **first** request can take ~50 seconds to wake it up — after that it is fast.

### Demo Accounts

| Role     | Email                    | Password      |
|----------|--------------------------|---------------|
| HR       | hr@staffsync.com         | hr123456      |
| Manager  | manager@staffsync.com    | manager123    |
| Employee | employee@staffsync.com   | employee123   |

The login page also has one-click buttons that fill these in.

---

## Features

**HR**
- Add / edit / delete / search employee records
- Approve or reject leave requests
- View all attendance records, filter by date, per-employee report, export to CSV
- Post, edit and delete announcements targeted to All / Employees / Managers

**Manager**
- Review leave applications (filter by status) and approve/reject them
- Create, edit, delete training programs and assign them to employees
- Post announcements

**Employee**
- Check in / check out (daily attendance) and view history
- Apply for leave, track status, cancel pending requests
- View announcements and assigned trainings
- View and update personal profile (name, department, phone, address, password)

**Security**
- Passwords hashed with bcrypt
- JWT authentication (`Authorization: Bearer <token>`)
- Role-based access control on every API route and every frontend route

---

## Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 19 (Vite), React Router, Axios, Bootstrap 5 |
| Backend   | Node.js, Express 5, JWT, bcryptjs |
| Database  | MongoDB with Mongoose |
| Hosting   | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

## Architecture

The backend follows **MVC**:
- **Models** (`server/models`) — Mongoose schemas: User, Employee, Leave, Attendance, Announcement, Training
- **Controllers** (`server/controllers`) — business logic for each module
- **Routes** (`server/routes`) — REST endpoints that map to controllers, protected by `middleware/authMiddleware.js`

```
staffsync/
├── client/                     React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           Login, Register
│   │   │   ├── employee/       Announcements, Attendance, LeaveApply, LeaveList, Profile
│   │   │   ├── hr/             LeaveApplications, EmployeeCRUD, AnnouncementsManager, AttendanceSummary
│   │   │   ├── manager/        LeaveApplications, TrainingManagement
│   │   │   ├── common/         Topbar, Tabs, Status, Alert
│   │   │   └── Home.jsx
│   │   ├── pages/              EmployeeDashboard, HrDashboard, ManagerDashboard
│   │   ├── routes/             ProtectedRoute
│   │   ├── api.js              Axios instance + session helpers
│   │   ├── App.jsx / App.css / main.jsx
│   └── vercel.json             SPA routing for Vercel
└── server/                     Express backend
    ├── config/db.js
    ├── controllers/
    ├── middleware/authMiddleware.js
    ├── models/
    ├── routes/
    ├── seed.js                 Demo data
    └── server.js
```

---

## Run Locally

**Requirements:** Node.js 20+ (Vite 8 needs 20.19 or newer), npm, and MongoDB (local install or a free Atlas cluster).

### 1. Backend
```bash
cd server
npm install
cp .env.example .env        # on Windows: copy .env.example .env
# edit .env -> set MONGO_URI and JWT_SECRET
npm run seed                # optional: loads demo accounts + sample data
npm run dev                 # starts on http://localhost:8000
```

### 2. Frontend
```bash
cd client
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:8000/api
npm run dev                 # opens on http://localhost:5173
```

### Environment variables

`server/.env`
```
MONGO_URI=mongodb://localhost:27017/hrm
JWT_SECRET=a_long_random_secret
JWT_EXPIRES_IN=7d
PORT=8000
CLIENT_URL=http://localhost:5173
```

`client/.env`
```
VITE_API_URL=http://localhost:8000/api
```

---

## API Reference

All routes except register/login need `Authorization: Bearer <token>`.

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register (name, email, password, role) |
| POST | /api/auth/login | Public | Login, returns token + user |
| GET / PUT | /api/auth/me | Any | View / update own profile |
| GET | /api/auth/users?role=Employee | HR, Manager | List users |
| GET / POST | /api/employees | HR | List / add employees |
| GET / PUT / DELETE | /api/employees/:id | HR | View / edit / delete employee |
| POST | /api/leaves | Employee | Apply for leave |
| GET | /api/leaves/my | Employee | Own leave requests |
| DELETE | /api/leaves/:id | Employee | Cancel a pending request |
| GET | /api/leaves | HR, Manager | All leave requests |
| PUT | /api/leaves/:id/status | HR, Manager | Approve / reject |
| POST | /api/attendance/checkin, /checkout | Any | Mark attendance |
| GET | /api/attendance/my, /today | Any | Own attendance |
| GET | /api/attendance?from=&to= | HR | All records |
| GET | /api/attendance/report | HR | Per-employee summary |
| GET | /api/announcements | Any | Announcements for your role |
| POST / PUT / DELETE | /api/announcements(/:id) | HR, Manager | Manage announcements |
| GET | /api/trainings | Any | Trainings (employees see only theirs) |
| POST / PUT / DELETE | /api/trainings(/:id) | Manager | Manage trainings |

---

## Deployment (free)

See **DEPLOYMENT.md** for the full step-by-step guide.

## Author

Vidushi Singh — Information Technology
