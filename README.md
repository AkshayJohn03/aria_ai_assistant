# Aria AI Assistant

A powerful local AI assistant powered by Ollama models with advanced features including web search, multi-model council deliberation, document processing, and persistent memory.

## 🚀 Quick Start

### Option 1: One-Command Startup (Recommended)
```bash
./start_aria.sh
```

This script will:
- Check and start Ollama if needed
- Set up Python virtual environment
- Install dependencies
- Start both frontend and backend
- Open the application in your browser

### Option 2: Manual Startup

#### 1. Start Ollama
```bash
ollama serve
```

#### 2. Start the Backend
```bash
cd aria_backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

#### 3. Start the Frontend
```bash
npm install
npm start
```

## 🌐 Access Points

- **Frontend**: http://localhost:4028
- **Backend API**: http://localhost:5050
- **Ollama**: http://localhost:11434

## ✨ Features

### 🤖 AI Capabilities
- **Local Models**: Uses your installed Ollama models
- **Persistent Memory**: Remembers conversations across sessions
- **System Prompts**: Customizable AI personality and behavior
- **Temperature Control**: Adjust response creativity and randomness

### 🔍 Web Search
- **Toggle Web Search**: Include real-time information in responses
- **Fallback Support**: Perplexity API (if configured) or DuckDuckGo
- **Context Integration**: Search results automatically included in AI context

### 🧠 Deep Think Mode
- **Multi-Model Council**: Multiple AI models deliberate on complex problems
- **Council Notes**: View individual model insights (optional)
- **Collaborative Problem Solving**: Best of multiple AI perspectives

### 📁 File Intelligence
- **Upload Support**: Images, PDFs, Word, Excel, Text files
- **Image OCR**: Automatic text extraction from images
- **Document Analysis**: AI-powered document understanding
- **Export Options**: Download responses as PDF or Word documents

### 💾 Memory & Sessions
- **Session Management**: Multiple independent conversation threads
- **Persistent Storage**: JSON-based memory across app restarts
- **Context Awareness**: AI remembers previous interactions

## 🛠️ Configuration

### Environment Variables
Copy `env.example` to `.env` and customize:

```bash
# Frontend
VITE_API_BASE_URL=http://localhost:5050
VITE_DEFAULT_MODEL=aria-gemma3-1b:latest
VITE_DEFAULT_TEMPERATURE=0.7

# Backend
ARIA_MAIN_MODEL=aria-uncensored
ARIA_COUNCIL_MODELS=deepseek-r1:1.5b,qwen2.5-0.5b-q4
```

### Model Configuration
Update `aria_backend/config.example.env` with your installed models:

```bash
ARIA_MAIN_MODEL=aria-gemma3-1b:latest
ARIA_COUNCIL_MODELS=gemma3:1b,HammerAI/openhermes-2.5-mistral:latest
```

## 📁 Project Structure

```
aria_ai_assistant/
├── src/                          # React frontend
│   ├── pages/main-chat-interface/  # Main chat UI
│   ├── components/ui/              # Reusable UI components
│   └── ...
├── aria_backend/                  # Flask backend
│   ├── app.py                     # Main Flask application
│   ├── utils/                     # Utility modules
│   │   ├── ollama_client.py       # Ollama API client
│   │   ├── memory.py              # Session memory management
│   │   ├── search.py              # Web search functionality
│   │   ├── docs.py                # Document processing
│   │   └── council.py             # Multi-model council
│   └── requirements.txt           # Python dependencies
├── start_aria.sh                  # Startup script
└── README.md                      # This file
```

## 🔧 API Endpoints

### Core Chat
- `POST /api/chat` - Send message, get AI response
- `POST /api/session/new` - Create new conversation session
- `GET /api/session/<id>` - Get session history
- `DELETE /api/session/<id>` - Delete session

### File Operations
- `POST /api/upload` - Upload files (with OCR for images)
- `POST /api/pdf/create` - Create PDF from text
- `POST /api/pdf/annotate` - Add notes to existing PDF
- `POST /api/excel/update` - Create/update Excel files
- `POST /api/docx/create` - Create Word documents
- `GET /api/download` - Download generated files

### System
- `GET /api/health` - Backend health check

## 🎯 Usage Examples

### Basic Chat
1. Type your message in the chat input
2. Toggle **Web Search** for real-time information
3. Toggle **Deep Think** for complex problem-solving
4. Use **System Instructions** to customize AI behavior

### File Upload
1. Click the paperclip icon
2. Select your file (image, PDF, Word, Excel, text)
3. Images automatically get OCR text extraction
4. AI analyzes and responds with file insights

### Export Responses
1. After receiving a response, export buttons appear
2. Choose PDF or Word format
3. Files download automatically
4. View all files in the right sidebar

### Deep Think Mode
1. Enable **Deep Think** toggle
2. Ask complex questions
3. Multiple AI models deliberate
4. Get comprehensive, multi-perspective answers
5. Optionally view council notes

## 🚨 Troubleshooting

### Common Issues

**Backend Connection Failed**
- Ensure `aria_backend` is running on port 5050
- Check Python virtual environment is activated
- Verify all dependencies are installed

**Ollama Not Responding**
- Run `ollama serve` to start Ollama
- Check `ollama list` for installed models
- Verify model names in configuration

**Port Already in Use**
- Use `lsof -tiTCP:5050 | xargs -r kill -9` to free port 5050
- Use `lsof -tiTCP:4028 | xargs -r kill -9` to free port 4028

**File Upload Issues**
- Check file size limits
- Ensure file types are supported
- Verify backend has write permissions

### Debug Mode
Enable debug logging in `aria_backend/app.py`:
```python
app.run(host="127.0.0.1", port=5050, debug=True)
```

## 🔒 Security Notes

- **Local Only**: All processing happens on your machine
- **No Data Leakage**: Conversations stay local
- **Model Safety**: Depends on your installed Ollama models
- **File Handling**: Uploaded files stored locally in `aria_backend/data/`

## 🚀 Advanced Features

### Custom Model Integration
Add your own models to the council in `aria_backend/utils/council.py`:

```python
COUNCIL = [
    "your-model:latest",
    "another-model:latest"
]
```

### Web Search Providers
Configure additional search providers in `aria_backend/utils/search.py`:

```python
# Add your API keys
PERPLEXITY_API_KEY = "your_key_here"
```

### Document Processing
Extend document capabilities in `aria_backend/utils/docs.py`:

```python
# Add support for new file types
def process_custom_format(file_path):
    # Your custom processing logic
    pass
```

## 📝 Development

### Adding New Features
1. Backend: Add endpoints in `aria_backend/app.py`
2. Frontend: Update React components in `src/`
3. Utils: Extend utility modules as needed
4. Test: Verify both frontend and backend work together

### Building for Production
```bash
# Frontend
npm run build

# Backend (optional)
cd aria_backend
pip install pyinstaller
pyinstaller --onefile app.py
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source. Feel free to modify and distribute.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API documentation
3. Check Ollama and model compatibility
4. Open an issue on GitHub

---

**Happy AI Assisting! 🚀**
