@echo off
echo Starting Reviews System...
echo.
echo Backend (NestJS) will run on: http://localhost:8000
echo Frontend (React) should run on: http://localhost:5173
echo.
echo Make sure MongoDB is running and accessible
echo.
cd reviews-system
start "Reviews Backend" cmd /k "npm run start:dev"
echo.
echo Reviews system backend started!
echo Check the terminal window for logs.
echo.
pause