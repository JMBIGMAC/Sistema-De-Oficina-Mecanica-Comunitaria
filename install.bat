@echo off
REM TemplateV2 Installation Script for Windows
REM This script installs all dependencies for both frontend and backend

echo 🚀 TemplateV2 - Installing all dependencies...
echo ================================================

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python first.
    echo    Visit: https://python.org/
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

echo ✅ Python version:
python --version
echo.

REM Install Frontend Dependencies
echo 📦 Installing Frontend Dependencies...
cd frontend
if exist package.json (
    npm install
    if %errorlevel% equ 0 (
        echo ✅ Frontend dependencies installed successfully!
    ) else (
        echo ❌ Failed to install frontend dependencies!
        pause
        exit /b 1
    )
) else (
    echo ❌ Frontend package.json not found!
    pause
    exit /b 1
)
cd ..

REM Install Backend Dependencies
echo 📦 Installing Backend Dependencies...
cd backend

REM Create virtual environment if it doesn't exist
if not exist venv (
    echo 🔧 Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment and install dependencies
echo 🔧 Activating virtual environment and installing dependencies...
call venv\Scripts\activate.bat

if exist requirements.txt (
    python -m pip install --upgrade pip
    pip install -r requirements.txt
    if %errorlevel% equ 0 (
        echo ✅ Backend dependencies installed successfully!
    ) else (
        echo ❌ Failed to install backend dependencies!
        pause
        exit /b 1
    )
) else (
    echo ❌ Backend requirements.txt not found!
    pause
    exit /b 1
)

REM Run Django migrations
echo 🔧 Running Django migrations...
python manage.py migrate

cd ..

echo.
echo 🎉 Installation completed successfully!
echo.
echo Next steps:
echo   • Run 'start.bat' to start both frontend and backend servers
echo   • Frontend will be available at: http://localhost:3000
echo   • Backend API will be available at: http://localhost:8000
echo.
pause