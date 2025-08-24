#!/bin/bash

echo "🚀 Starting PixelCraft Pro Development Environment"

# Function to check if port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
}

# Check if backend is running
if check_port 8000; then
    echo "✅ Backend is already running on port 8000"
else
    echo "🔧 Starting backend..."
    cd ../backend
    if [ -f "start.sh" ]; then
        ./start.sh dev &
        echo "🔧 Backend starting in background..."
        cd ../frontend
    else
        echo "❌ Backend start.sh not found. Please set up backend first."
        exit 1
    fi
fi

# Start frontend
echo "🎨 Starting frontend..."
npm start
