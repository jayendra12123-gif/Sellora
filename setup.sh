#!/bin/bash

# Sellora Setup Script - Run this to start the development environment

echo "🚀 Starting Sellora E-commerce Platform..."
echo ""
echo "Sellora - Complete E-commerce Platform with Authentication"
echo "========================================================"
echo ""
echo "This script will help you set up and run the entire application."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js is installed: $(node -v)"
echo ""

# Backend setup
echo "📦 Setting up backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "✅ Backend dependencies already installed"
fi

# Start backend in background
echo ""
echo "🔥 Starting backend server on port 5000..."
npm start &
BACKEND_PID=$!

# Give backend time to start
sleep 2

# Return to root
cd ..

# Web frontend setup
echo ""
echo "📦 Setting up web app..."
cd web

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi

# Start frontend
echo ""
echo "🎨 Starting web development server on port 5173..."
echo ""
echo "========================================================="
echo "✅ Application is ready!"
echo "========================================================="
echo ""
echo "📍 Web:      http://localhost:5173"
echo "📍 Backend:  http://localhost:5000"
echo ""
echo "📖 Features:"
echo "   ✓ User Registration & Login"
echo "   ✓ Protected Routes (Checkout & Profile)"
echo "   ✓ Shopping Cart with Local Storage"
echo "   ✓ User Profile Management"
echo "   ✓ Beautiful Tailwind CSS Design"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "========================================================="
echo ""

npm run dev

# Cleanup
kill $BACKEND_PID 2>/dev/null
