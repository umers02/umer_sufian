# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### 1. Backend Won't Start

**Error: Port 5000 already in use**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

**Error: Cannot connect to MongoDB**
- Check `.env` file exists in `backend/` folder
- Verify `MONGO_URI` is correct
- Ensure MongoDB is running (local or Atlas)

### 2. Frontend Won't Start

**Error: Port 5173 already in use**
```bash
# Find and kill process
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Error: Module not found**
```bash
cd frontend
npm install
```

### 3. CORS Errors

**Error: Access-Control-Allow-Origin**
- Ensure backend is running FIRST
- Check `backend/server.js` has `app.use(cors())`
- Verify frontend is calling `http://localhost:5000/api`

### 4. Authentication Issues

**Error: 401 Unauthorized**
- Login again to refresh token
- Check browser localStorage has 'token' key
- Verify token format: `Bearer <token>`

**Can't login after registration**
- Check backend console for errors
- Verify MongoDB connection
- Check user was created in database

### 5. API Not Working

**Error: Network Error**
```javascript
// Check API base URL in frontend/src/services/api.js
baseURL: 'http://localhost:5000/api'  // Should match backend port
```

**Error: 404 Not Found**
- Verify backend routes are registered
- Check endpoint spelling
- Ensure backend is running

### 6. GSAP Animations Not Working

**Animations don't play**
- Check browser console for errors
- Verify GSAP is installed: `npm list gsap`
- Clear browser cache

### 7. MUI Components Not Styled

**Components look plain**
```bash
# Reinstall MUI packages
cd frontend
npm install @mui/material @emotion/react @emotion/styled
```

### 8. DataGrid Issues

**Error: Invalid rows**
- Ensure each row has unique `_id` field
- Check `getRowId={(row) => row._id}` prop
- Verify API returns array of objects

### 9. Form Validation Errors

**Can't submit form**
- Check all required fields are filled
- Verify email format
- Password must be 6+ characters
- Skills/Tech stack: comma-separated values

### 10. Database Issues

**Data not persisting**
- Check MongoDB connection string
- Verify models are correct
- Check backend console for save errors

**Can't delete items**
- Ensure item ID is correct
- Check for foreign key constraints
- Verify delete endpoint works in Postman

## Quick Fixes

### Reset Everything
```bash
# Stop all servers (Ctrl+C)

# Backend
cd backend
rm -rf node_modules
npm install
npm start

# Frontend (new terminal)
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Clear Browser Data
1. Open DevTools (F12)
2. Application tab
3. Clear Storage → Clear site data
4. Refresh page

### Check Logs
```bash
# Backend logs
cd backend
npm start
# Watch console for errors

# Frontend logs
# Open browser DevTools (F12)
# Check Console tab
```

## Environment Variables

**Backend `.env` should have:**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/team-portal
JWT_SECRET=your_secret_key_here
```

## Verification Checklist

- [ ] MongoDB running
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] No CORS errors in console
- [ ] Can register new user
- [ ] Can login
- [ ] Token saved in localStorage
- [ ] Can access protected routes
- [ ] Can create/edit/delete items

## Still Having Issues?

1. Check all files are created correctly
2. Verify package.json dependencies
3. Restart both servers
4. Clear browser cache
5. Check browser console for errors
6. Check backend terminal for errors
7. Test API endpoints in Postman first
8. Verify MongoDB has data

## Contact Points

- Backend API: http://localhost:5000/api
- Frontend: http://localhost:5173
- MongoDB: mongodb://localhost:27017
