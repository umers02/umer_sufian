# Team & Project Management Portal

Full-stack MERN application with Material-UI and GSAP animations for managing projects and team members.

## 🚀 Quick Start

### 1. Start Backend
```bash
cd backend
npm start
```
✅ Running on: http://localhost:5000

### 2. Start Frontend
```bash
cd frontend
npm run dev
```
✅ Running on: http://localhost:5173

## 📋 Features

### Authentication
- Register/Login with JWT
- Protected routes
- GSAP animated forms

### Dashboard
- Animated hero section
- Real-time stats cards
- Project & member counts

### Projects Management
- Create, Read, Update, Delete
- Assign team members
- Tech stack tags
- Status tracking (active/completed)
- MUI Cards with animations

### Team Members
- CRUD operations
- MUI DataGrid table
- Skills management
- Member assignment to projects

## 🎨 Tech Stack

**Frontend:**
- React 19 + Vite
- Material-UI (MUI)
- GSAP animations
- React Router
- Axios

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- bcrypt

## 📁 Project Structure

```
week4/
├── backend/
│   ├── config/          # Database config
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth & error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   └── server.js        # Entry point
├── frontend/
│   └── src/
│       ├── components/  # Reusable components
│       ├── context/     # Auth context
│       ├── pages/       # Route pages
│       ├── services/    # API calls
│       └── App.jsx      # Main app
└── *.md                 # Documentation
```

## 🧪 Testing

1. **Register** → Create account
2. **Add Members** → Create team members
3. **Create Projects** → Add projects with tech stack
4. **Assign Members** → Link members to projects
5. **View Dashboard** → See animated stats

## 📚 Documentation

- `FRONTEND_SETUP.md` - Frontend details
- `POSTMAN_TESTING_GUIDE.md` - API testing
- `START_APP.md` - Quick start commands
- `FEATURES_CHECKLIST.md` - Implementation status

## 🎭 GSAP Animations

- Login/Register: fadeIn, slideUp, stagger
- Dashboard: hero animation, cards stagger
- Projects: card entrance animations
- Hover effects throughout

## 🔗 API Endpoints

**Auth:**
- POST `/api/auth/register`
- POST `/api/auth/login`

**Projects:**
- GET/POST `/api/projects`
- GET/PUT/DELETE `/api/projects/:id`
- GET `/api/projects/stats`

**Members:**
- GET/POST `/api/members`
- GET/PUT/DELETE `/api/members/:id`

## ✅ All Features Implemented

See `FEATURES_CHECKLIST.md` for complete list.

## 🎯 Ready to Run!

Both frontend and backend are fully configured and ready to test.
