#!/bin/bash

echo "🚀 Starting Aria AI Assistant..."

# Check if Ollama is running
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "⚠️  Ollama is not running. Starting Ollama..."
    ollama serve &
    sleep 3
fi

# Check if aria_backend is already running
if curl -s http://localhost:5050/api/health > /dev/null 2>&1; then
    echo "✅ aria_backend is already running on port 5050"
else
    echo "🔧 Starting aria_backend..."
    cd aria_backend
    if [ ! -d ".venv" ]; then
        echo "📦 Creating Python virtual environment..."
        python3 -m venv .venv
    fi
    
    echo "🔌 Activating virtual environment and installing dependencies..."
    source .venv/bin/activate
    pip install -r requirements.txt
    
    echo "🚀 Starting aria_backend on port 5050..."
    python app.py &
    cd ..
    sleep 3
fi

# Check if frontend is already running
if curl -s http://localhost:4028 > /dev/null 2>&1; then
    echo "✅ Frontend is already running on port 4028"
else
    echo "🌐 Starting frontend..."
    npm start &
    sleep 3
fi

echo ""
echo "🎉 Aria AI Assistant is ready!"
echo ""
echo "📱 Frontend: http://localhost:4028"
echo "🔧 Backend:  http://localhost:5050"
echo "🤖 Ollama:   http://localhost:11434"
echo ""
echo "💡 Features available:"
echo "   • Web Search (toggle in UI)"
echo "   • Deep Think mode (multi-model council)"
echo "   • File uploads (images, PDFs, Word, Excel)"
echo "   • Export responses as PDF/Word"
echo "   • Persistent memory across sessions"
echo ""
echo "🛑 To stop all services, press Ctrl+C and run: pkill -f 'aria_backend\|npm start'"
echo ""

# Wait for user input to stop
read -p "Press Enter to stop all services..."
echo "🛑 Stopping services..."
pkill -f "aria_backend"
pkill -f "npm start"
echo "✅ All services stopped." 