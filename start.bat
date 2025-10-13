@echo off
REM TemplateV2 Development Server Startup Script for Windows
REM This script starts both frontend and backend servers simultaneously

setlocal EnableDelayedExpansion

echo 🚀 TemplateV2 - Starting Development Servers...
echo ===============================================

REM Check if dependencies are installed
if not exist "frontend\node_modules" (
    echo ❌ Frontend dependencies not found. Run 'install.bat' first.
    pause
    exit /b 1
)

if not exist "backend\venv" (
    echo ❌ Backend virtual environment not found. Run 'install.bat' first.
    pause
    exit /b 1
)

REM Create log directory
if not exist logs mkdir logs

echo 🔧 Starting Backend Server (Django)...
cd backend
call venv\Scripts\activate.bat
start /B python manage.py runserver 8000 > ..\logs\backend.log 2>&1
cd ..

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

echo ✅ Backend server started
echo    URL: http://localhost:8000
echo    API Health: http://localhost:8000/api/health/

echo 🔧 Starting Frontend Server (React)...
cd frontend
start /B npm start > ..\logs\frontend.log 2>&1
cd ..

REM Wait a moment for frontend to start
timeout /t 5 /nobreak >nul

echo ✅ Frontend server started
echo    URL: http://localhost:3000

echo.
echo 🎉 Both servers are running successfully!
echo.
echo 📍 URLs:
echo    • Frontend: http://localhost:3000
echo    • Backend:  http://localhost:8000
echo    • API:      http://localhost:8000/api/
echo    • Admin:    http://localhost:8000/admin/
echo.
echo 📝 Logs:
echo    • Frontend: logs\frontend.log
echo    • Backend:  logs\backend.log
echo.
echo 💡 Close this window to stop the servers
echo    Or press any key to continue...
pause >nul