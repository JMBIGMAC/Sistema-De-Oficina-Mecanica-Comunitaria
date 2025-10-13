#!/bin/bash

# TemplateV2 Development Server Startup Script
# This script starts both frontend and backend servers simultaneously

set -e  # Exit on any error

echo "🚀 TemplateV2 - Starting Development Servers..."
echo "==============================================="

# Check if dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Frontend dependencies not found. Run './install.sh' first."
    exit 1
fi

if [ ! -d "backend/venv" ]; then
    echo "❌ Backend virtual environment not found. Run './install.sh' first."
    exit 1
fi

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    wait 2>/dev/null || true
    echo "✅ Servers stopped."
    exit 0
}

# Set up signal handling
trap cleanup SIGINT SIGTERM

# Create log directory
mkdir -p logs

echo "🔧 Starting Backend Server (Django)..."
cd backend
source venv/bin/activate
nohup python manage.py runserver 8000 > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo "✅ Backend server started (PID: $BACKEND_PID)"
    echo "   URL: http://localhost:8000"
    echo "   API Health: http://localhost:8000/api/health/"
else
    echo "❌ Failed to start backend server"
    exit 1
fi

echo "🔧 Starting Frontend Server (React)..."
cd frontend
nohup npm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait a moment for frontend to start
sleep 5

# Check if frontend is running
if kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "✅ Frontend server started (PID: $FRONTEND_PID)"
    echo "   URL: http://localhost:3000"
else
    echo "❌ Failed to start frontend server"
    cleanup
    exit 1
fi

echo ""
echo "🎉 Both servers are running successfully!"
echo ""
echo "📍 URLs:"
echo "   • Frontend: http://localhost:3000"
echo "   • Backend:  http://localhost:8000"
echo "   • API:      http://localhost:8000/api/"
echo "   • Admin:    http://localhost:8000/admin/"
echo ""
echo "📝 Logs:"
echo "   • Frontend: logs/frontend.log"
echo "   • Backend:  logs/backend.log"
echo ""
echo "💡 Press Ctrl+C to stop all servers"
echo ""

# Keep script running and monitor processes
while true; do
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "❌ Frontend server stopped unexpectedly"
        cleanup
        exit 1
    fi
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo "❌ Backend server stopped unexpectedly"
        cleanup
        exit 1
    fi
    sleep 5
done