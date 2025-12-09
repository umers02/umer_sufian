# 🚀 Quick Start Guide

## Run Both Servers

### Option 1: Two Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
✅ Backend running on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend running on: http://localhost:5173

### Option 2: Single Command (Windows)
```bash
cd backend && start cmd /k npm start && cd ../frontend && npm run dev
```

## 🎯 First Time Setup

1. **Register Account**
   - Go to: http://localhost:5173
   - Click "Register"
   - Fill: Name, Email, Password
   - Auto-redirects to Dashboard

2. **Add Team Members**
   - Click "Members" in navbar
   - Click "Add Member"
   - Fill: Name, Email, Role, Skills (comma-separated)
   - Example: "React, Node.js, MongoDB"

3. **Create Projects**
   - Click "Projects" in navbar
   - Click "Add Project"
   - Fill: Title, Description, Tech Stack, Status
   - Assign team members from dropdown

4. **View Dashboard**
   - Click "Dashboard"
   - See animated stats cards
   - Stats update automatically

## 🔧 Troubleshooting

**Port Already in Use:**
```bash
# Backend (5000)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Frontend (5173)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**CORS Error:**
- Ensure backend is running first
- Check backend has `cors()` middleware

**401 Unauthorized:**
- Login again to refresh token
- Check localStorage has 'token' key

## 📱 Test URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Login: http://localhost:5173/login
- Dashboard: http://localhost:5173/dashboard
- Projects: http://localhost:5173/projects
- Members: http://localhost:5173/members
