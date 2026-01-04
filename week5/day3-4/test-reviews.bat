@echo off
echo Starting Reviews System Test...
echo.

echo 1. Starting NestJS Reviews Service...
cd reviews-system
start "Reviews Service" cmd /k "npm run start:dev"

echo 2. Waiting for service to start...
timeout /t 5

echo 3. Starting React Frontend...
cd ..\frontend
start "Frontend" cmd /k "npm run dev"

echo 4. Starting Express Backend...
cd ..\backend
start "Backend" cmd /k "npm start"

echo.
echo All services started!
echo - Reviews Service: http://localhost:8000
echo - Frontend: http://localhost:5173
echo - Backend: http://localhost:5000
echo.
echo Test the following features:
echo 1. Add a review to any product
echo 2. Reply to a review
echo 3. Like reviews and replies
echo 4. Check real-time notifications
echo.
pause