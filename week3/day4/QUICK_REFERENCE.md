# ⚡ Quick Reference Card

## 🚀 Start Commands

```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

## 🔗 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| API Base | http://localhost:5000/api |

## 📋 Test Credentials

```javascript
// Register/Login
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

## 🎯 Navigation

| Page | Route | Access |
|------|-------|--------|
| Login | `/login` | Public |
| Register | `/register` | Public |
| Dashboard | `/dashboard` | Protected |
| Projects | `/projects` | Protected |
| Members | `/members` | Protected |

## 📡 API Endpoints

### Auth
```
POST /api/auth/register
POST /api/auth/login
```

### Projects
```
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
GET    /api/projects/stats
```

### Members
```
GET    /api/members
POST   /api/members
GET    /api/members/:id
PUT    /api/members/:id
DELETE /api/members/:id
```

## 🎨 Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Navbar | `components/Navbar.jsx` | Navigation bar |
| ProtectedRoute | `components/ProtectedRoute.jsx` | Auth guard |
| Login | `pages/Login.jsx` | Login form |
| Register | `pages/Register.jsx` | Register form |
| Dashboard | `pages/Dashboard.jsx` | Stats dashboard |
| Projects | `pages/Projects.jsx` | Projects CRUD |
| Members | `pages/Members.jsx` | Members CRUD |

## 🔧 Key Files

| File | Purpose |
|------|---------|
| `backend/server.js` | Backend entry |
| `frontend/src/App.jsx` | Frontend entry |
| `frontend/src/services/api.js` | API calls |
| `frontend/src/context/AuthContext.jsx` | Auth state |
| `backend/.env` | Environment vars |

## 🎭 GSAP Animations

```javascript
// Login/Register
gsap.fromTo(element, 
  { opacity: 0, y: 50 }, 
  { opacity: 1, y: 0, duration: 0.8 }
);

// Stagger
gsap.fromTo(elements, 
  { opacity: 0, x: -30 }, 
  { opacity: 1, x: 0, stagger: 0.1 }
);
```

## 📦 Dependencies

**Frontend:**
- react, react-dom, react-router-dom
- @mui/material, @mui/icons-material, @mui/x-data-grid
- gsap, axios

**Backend:**
- express, mongoose, cors, dotenv
- jsonwebtoken, bcryptjs
- express-validator

## 🐛 Quick Fixes

```bash
# Port in use
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Reinstall
rm -rf node_modules && npm install

# Clear browser
F12 → Application → Clear Storage
```

## 📚 Documentation

| File | Content |
|------|---------|
| `README.md` | Main overview |
| `FRONTEND_SETUP.md` | Frontend guide |
| `START_APP.md` | Quick start |
| `FEATURES_CHECKLIST.md` | Features list |
| `VISUAL_GUIDE.md` | UI preview |
| `TROUBLESHOOTING.md` | Common issues |
| `PROJECT_SUMMARY.md` | Complete summary |

## ✅ Testing Checklist

- [ ] Backend starts on port 5000
- [ ] Frontend starts on port 5173
- [ ] Can register new user
- [ ] Can login
- [ ] Dashboard shows stats
- [ ] Can add member
- [ ] Can create project
- [ ] Can edit/delete items
- [ ] Animations work
- [ ] No console errors

## 🎯 Sample Data

**Member:**
```json
{
  "name": "Alice Smith",
  "email": "alice@example.com",
  "role": "Frontend Developer",
  "skills": ["React", "JavaScript", "CSS"],
  "phone": "+1234567890"
}
```

**Project:**
```json
{
  "title": "E-commerce Platform",
  "description": "Building modern e-commerce",
  "techStack": ["React", "Node.js", "MongoDB"],
  "status": "active",
  "teamMembers": []
}
```

## 🔑 Environment Variables

```env
# backend/.env
PORT=5000
MONGO_URI=mongodb://localhost:27017/team-portal
JWT_SECRET=your_secret_key_here
```

---

**Keep this card handy for quick reference!**
