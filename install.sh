#!/bin/bash

# TemplateV2 Installation Script
# This script installs all dependencies for both frontend and backend

set -e  # Exit on any error

echo "🚀 TemplateV2 - Installing all dependencies..."
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    echo "   Visit: https://python.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ Python version: $(python3 --version)"
echo ""

# Install Frontend Dependencies
echo "📦 Installing Frontend Dependencies..."
cd frontend
if [ -f "package.json" ]; then
    npm install
    echo "✅ Frontend dependencies installed successfully!"
else
    echo "❌ Frontend package.json not found!"
    exit 1
fi
cd ..

# Install Backend Dependencies
echo "📦 Installing Backend Dependencies..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "🔧 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
echo "🔧 Activating virtual environment and installing dependencies..."
source venv/bin/activate

if [ -f "requirements.txt" ]; then
    pip install --upgrade pip
    pip install -r requirements.txt
    echo "✅ Backend dependencies installed successfully!"
else
    echo "❌ Backend requirements.txt not found!"
    exit 1
fi

# Run Django migrations
echo "🔧 Running Django migrations..."
python manage.py migrate

cd ..

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "Next steps:"
echo "  • Run './start.sh' to start both frontend and backend servers"
echo "  • Frontend will be available at: http://localhost:3000"
echo "  • Backend API will be available at: http://localhost:8000"
echo ""