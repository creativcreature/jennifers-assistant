#!/bin/bash

# Start Jennifer's Assistant with ngrok for mobile testing
# This script starts the dev server and creates a public URL

echo "🚀 Starting Jennifer's Assistant with ngrok..."
echo ""
echo "This will:"
echo "1. Start the Next.js dev server on port 5001"
echo "2. Create a public ngrok URL for mobile testing"
echo ""
echo "Press Ctrl+C to stop both services"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $DEV_PID $NGROK_PID 2>/dev/null
    exit 0
}

trap cleanup EXIT INT TERM

# Start dev server in background
echo "📦 Starting dev server..."
npm run dev &
DEV_PID=$!

# Wait for dev server to be ready
echo "⏳ Waiting for dev server to start..."
sleep 5

# Start ngrok
echo "🌐 Starting ngrok tunnel..."
ngrok http 5001 &
NGROK_PID=$!

echo ""
echo "✅ Services started!"
echo ""
echo "📱 To test on Jennifer's phone:"
echo "1. Look at the ngrok output above for the 'Forwarding' URL"
echo "2. Text that https://xxxxx.ngrok.io URL to Jennifer's phone"
echo "3. The AI features will work since API keys are in .env.local"
echo ""
echo "💡 Keep this terminal open to keep the tunnel active"
echo "💡 Press Ctrl+C when done testing"
echo ""

# Wait for user to stop
wait
