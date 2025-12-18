# Physical AI & Humanoid Robotics Textbook

An AI-native textbook built with Docusaurus, featuring an integrated RAG chatbot for interactive learning.

## 🌐 Live Demo

- **Frontend (Vercel)**: [https://aibook-physical-ai.vercel.app](https://a-ibook-delta.vercel.app/)
- **Backend API (Hugging Face)**: https://maazahmedsiddiqui-physical-ai-api.hf.space
- **API Health Check**: https://maazahmedsiddiqui-physical-ai-api.hf.space/health
- **API Docs**: https://maazahmedsiddiqui-physical-ai-api.hf.space/docs

## 🚀 Features

- **8 Comprehensive Chapters** covering robotics, AI, and humanoid systems
- **RAG Chatbot** - Ask questions about the content, including selected text
- **Personalization** - Adapt content to your experience level (beginner/intermediate/advanced)
- **Urdu Translation** - Read in اردو with RTL support
- **Modern Dark Theme** - Beautiful, professional design

## 📚 Book Contents

1. **Introduction to Robotics and AI** - History, types, ethics
2. **Math & Programming Foundations** - Linear algebra, Python, C++, ROS2
3. **Robot Hardware Systems** - Sensors, actuators, microcontrollers
4. **Kinematics & Dynamics** - Forward/inverse kinematics, simulation
5. **AI for Robotics** - ML, deep learning, reinforcement learning, LLMs
6. **Perception & Interaction** - Computer vision, SLAM, HRI
7. **Humanoid Robotics** - Bipedal locomotion, balance, Physical AI
8. **Capstone Projects** - Project ideas and implementation guide

## 🛠️ Local Development

### Frontend (Docusaurus)

```bash
npm install
npm start
```

### Backend (FastAPI)

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
cp .env.example .env     # Add your GEMINI_API_KEY
uvicorn main:app --reload
```

## 🏗️ Deployment

| Component | Platform | URL |
|-----------|----------|-----|
| Frontend | Vercel | Auto-deploys from GitHub |
| Backend | Hugging Face Spaces | Docker-based deployment |

### Environment Variables

**Backend (Hugging Face Secrets):**
```
GEMINI_API_KEY=your_google_gemini_api_key
```

## 📁 Project Structure

```
aibook/
├── docs/                    # Book content (Markdown)
├── src/
│   ├── components/
│   │   ├── ChatbotWidget/   # RAG chatbot UI
│   │   └── ChapterActions/  # Personalize/Translate buttons
│   ├── config/api.ts        # Backend URL configuration
│   └── theme/Root.tsx       # Global component wrapper
├── backend/
│   ├── main.py              # FastAPI app
│   ├── config.py            # Settings
│   └── services/            # RAG, Translation, Personalization
├── hf-space/                # Hugging Face deployment files
└── CUSTOMIZATION_GUIDE.md   # How to customize everything
```

## 🔧 Technologies

- **Frontend**: Docusaurus 3.7, React 18, TypeScript
- **Backend**: FastAPI, Python 3.11
- **AI**: Google Gemini API (Free tier)
- **Hosting**: Vercel (frontend) + Hugging Face Spaces (backend)

## 📖 Usage

1. Browse the textbook at `/docs/intro`
2. Click the chat button (💬) to ask questions
3. Select any text and ask follow-up questions about it
4. Use ✨ Personalize button for adapted content
5. Use 🌐 اردو button for Urdu translation

## 📝 License

MIT License

## 🙏 Acknowledgments

- [Panaversity](https://panaversity.org) - Inspiration
- [Docusaurus](https://docusaurus.io) - Documentation framework
- [Google Gemini](https://ai.google.dev) - AI API
- [Hugging Face](https://huggingface.co) - Backend hosting
