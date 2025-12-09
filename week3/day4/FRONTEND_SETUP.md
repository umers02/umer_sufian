# Frontend Setup & Run Guide

## ✅ Installation Complete
All dependencies are already installed in `package.json`:
- React 19 + React Router
- Material-UI (MUI) + Icons + DataGrid
- GSAP for animations
- Axios for API calls

## 🚀 Quick Start

### 1. Start Backend (Terminal 1)
```bash
cd backend
npm start
```
Server runs on: `http://localhost:5000`

### 2. Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

## 📁 Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar
│   │   └── ProtectedRoute.jsx  # Auth guard
│   ├── context/
│   │   └── AuthContext.jsx     # Global auth state
│   ├── pages/
│   │   ├── Login.jsx           # Login with GSAP
│   │   ├── Register.jsx        # Register with GSAP
│   │   ├── Dashboard.jsx       # Stats dashboard
│   │   ├── Projects.jsx        # Projects CRUD
│   │   └── Members.jsx         # Members CRUD
│   ├── services/
│   │   └── api.js              # Axios API calls
│   ├── App.jsx                 # Main app + routing
│   └── main.jsx                # Entry point
```

## 🎨 Features Implemented

### ✅ Authentication
- Login/Register with GSAP animations (fadeIn, slideUp, stagger)
- JWT token auto-saved in localStorage
- Protected routes with auth guard

### ✅ Dashboard
- Hero section with GSAP animations
- 4 stat cards: Total Projects, Active, Completed, Team Members
- Animated card entrance with stagger effect

### ✅ Projects Module
- MUI Cards with hover effects
- Add/Edit/Delete with MUI Dialog
- GSAP card animations on load
- Tech stack chips
- Status badges (active/completed)
- Assign team members to projects

### ✅ Members Module
- MUI DataGrid for table view
- Add/Edit/Delete operations
- Skills as comma-separated values
- Responsive layout

### 🎭 GSAP Animations Used
- **Login**: fadeIn + slideUp + stagger fields
- **Register**: scale + fadeIn + stagger
- **Dashboard**: hero slideDown + cards stagger scale
- **Projects**: cards slideUp stagger on load
- **Hover effects**: MUI built-in transitions

## 🔗 API Integration
All endpoints connected:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET/POST/PUT/DELETE /api/projects`
- `GET /api/projects/stats`
- `GET/POST/PUT/DELETE /api/members`

## 🧪 Testing Flow

1. **Register** → Auto-login → Redirect to Dashboard
2. **Dashboard** → View stats (initially 0)
3. **Members** → Add team members (Alice, Bob, etc.)
4. **Projects** → Create projects, assign members
5. **Dashboard** → Stats update automatically

## 🎯 Next Steps (Optional Enhancements)

- Dark/Light mode toggle
- Page transition animations with GSAP
- Project timeline with MUI Stepper
- Search/Filter functionality
- Pagination for large datasets
