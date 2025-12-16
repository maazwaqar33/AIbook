# Physical AI & Humanoid Robotics Textbook

A comprehensive AI-native textbook built for the Panaversity Hackathon, featuring an integrated RAG chatbot for interactive learning.

## 🚀 Features

- **8 Comprehensive Chapters** covering robotics, AI, and humanoid systems
- **RAG Chatbot** - Ask questions about the content, including selected text
- **Personalization** (UI Ready) - Adapt content to your experience level
- **Urdu Translation** (UI Ready) - Read in اردو
- **Modern Dark Theme** - Beautiful, futuristic design

## 📚 Book Contents

1. **Introduction to Robotics and AI** - History, types, ethics
2. **Math & Programming Foundations** - Linear algebra, Python, C++, ROS2
3. **Robot Hardware Systems** - Sensors, actuators, microcontrollers
4. **Kinematics & Dynamics** - Forward/inverse kinematics, simulation
5. **AI for Robotics** - ML, deep learning, reinforcement learning, LLMs
6. **Perception & Interaction** - Computer vision, SLAM, HRI
7. **Humanoid Robotics** - Bipedal locomotion, balance, Physical AI
8. **Capstone Projects** - Project ideas and implementation guide

## 🛠️ Setup

### Frontend (Docusaurus Book)

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Backend (RAG Chatbot)

```bash
cd backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment
cp .env.example .env
# Edit .env with your API keys

# Run the server
uvicorn main:app --reload

# Ingest book content
curl -X POST http://localhost:8000/api/ingest/batch
```

### Required API Keys

1. **OpenAI** - For embeddings and chat (required)
2. **Qdrant Cloud** - Free tier at cloud.qdrant.io (recommended)
3. **Neon Postgres** - For user data (optional)

## 🏗️ Project Structure

```
aibook/
├── docs/                    # Book content (Markdown)
│   ├── intro.md
│   ├── chapter-01-introduction/
│   ├── chapter-02-foundations/
│   └── ...
├── src/
│   ├── components/
│   │   ├── ChatbotWidget/   # RAG chatbot UI
│   │   └── ChapterActions/  # Personalize/Translate buttons
│   └── theme/
│       └── Root.tsx         # Global component wrapper
├── backend/
│   ├── main.py              # FastAPI app
│   ├── config.py            # Settings
│   └── services/
│       └── rag_service.py   # RAG implementation
├── .agent/
│   ├── skills/              # Claude Code skills
│   └── subagents/           # Content processing
└── static/                  # Images and assets
```

## 🔧 Technologies

- **Frontend**: Docusaurus 3.7, React 18, TypeScript
- **Backend**: FastAPI, Python 3.10+
- **AI/ML**: OpenAI API, Qdrant Vector DB
- **Database**: Neon Serverless Postgres
- **Dev Tools**: Claude Code, Spec-Kit Plus

## 📖 Usage

1. Browse the textbook at `/docs/intro`
2. Click the chat button (bottom right) to ask questions
3. Select any text and ask follow-up questions about it
4. Use Personalize button (if logged in) for adapted content
5. Use اردو button for Urdu translation

## 📝 License

MIT License - Built for Panaversity Hackathon I

## 🙏 Acknowledgments

- [Panaversity](https://panaversity.org) - Hackathon hosts
- [Spec-Kit Plus](https://github.com/panaversity/spec-kit-plus) - Development workflow
- [Docusaurus](https://docusaurus.io) - Documentation framework
