#!/bin/bash
# Start script for Control Station OS

echo "🚀 Starting Control Station OS Development Server..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Run with npx to ensure vite is found
echo "⚡ Starting development server..."
npx vite