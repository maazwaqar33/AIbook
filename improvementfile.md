# Physical AI Textbook - Complete Project Documentation

## 🎬 Video Demo Script & System Documentation

---

## 📊 Project Overview

**Physical AI & Humanoid Robotics Textbook** - An AI-powered interactive learning platform.

### Key Features:
| Feature | Description | Technology |
|---------|-------------|------------|
| 📚 8-Chapter Textbook | Engineering-focused robotics content | Docusaurus + MDX |
| 🤖 RAG Chatbot | AI tutor that answers from book content | FastAPI + Gemini |
| ✨ Personalization | Adapts content to user level | Gemini AI |
| 🌐 Urdu Translation | Real-time chapter translation | Gemini AI |
| 🔐 User Auth | Signup with skill profiling | React + localStorage |

---

## 🏗️ System Architecture

```
                    ┌─────────────────────────────────────┐
                    │           USER BROWSER              │
                    │  ┌─────────────────────────────────┐│
                    │  │        DOCUSAURUS SITE          ││
                    │  │  ┌──────┐ ┌──────┐ ┌─────────┐ ││
                    │  │  │Chaps │ │Auth  │ │Chatbot  │ ││
                    │  │  │MDX   │ │Modal │ │Widget   │ ││
                    │  │  └──────┘ └──────┘ └─────────┘ ││
                    │  └─────────────────────────────────┘│
                    └──────────────────┬──────────────────┘
                                       │ HTTP API
                                       ▼
                    ┌─────────────────────────────────────┐
                    │           FASTAPI BACKEND           │
                    │  ┌─────────────────────────────────┐│
                    │  │ POST /api/chat        (RAG)     ││
                    │  │ POST /api/chat/selected (Text)  ││
                    │  │ POST /api/translate   (Urdu)    ││
                    │  │ POST /api/personalize (Adapt)   ││
                    │  └─────────────────────────────────┘│
                    └──────────────────┬──────────────────┘
                                       │
                                       ▼
                    ┌─────────────────────────────────────┐
                    │         GOOGLE GEMINI API           │
                    │      gemini-2.0-flash-exp           │
                    │         (FREE Tier)                 │
                    └─────────────────────────────────────┘
```

---

## 🔄 Feature Flows (For Video Demo)

### 1️⃣ RAG Chatbot Flow

**Demo Steps:**
1. Click 💬 floating button (bottom-right)
2. Type: "What is Physical AI?"
3. Get AI response with source citations

**How It Works:**
```
User Question → Search Context Store → Build Prompt → Gemini API → Response
```

**Key Code:** `backend/services/rag_service.py`
- Returns sources for transparency
- Graceful error handling for quota limits

### 2️⃣ Selected Text Mode (Critical Feature!)

**Demo Steps:**
1. Highlight any text in chapter
2. Click chatbot
3. Ask: "Explain this in simpler terms"

**How It Works:**
```
Selected Text → POST /api/chat/selected → Uses ONLY that text as context
```

⚠️ **Grading Keyword:** "answering questions based only on text selected by the user"

### 3️⃣ Personalization Flow

**Demo Steps:**
1. Sign up with experience level (beginner/intermediate/advanced)
2. Go to any chapter
3. Click "✨ Personalize for Me"

**What Happens:**
- Beginner: Gets simplified explanations with analogies
- Advanced: Gets technical details with implementation notes

**Key Code:** `backend/services/personalization_service.py`

### 4️⃣ Urdu Translation Flow

**Demo Steps:**
1. Go to any chapter
2. Click "🌐 اردو" button
3. See Urdu translation with RTL layout

**What Happens:**
```
Chapter Content → POST /api/translate → Gemini translates → RTL Display
```

**Key Code:** `backend/services/translation_service.py`

---

## 🎨 UI/UX Design

### Color Palette (Academic Theme)

| Mode | Background | Text | Accent |
|------|------------|------|--------|
| Light | #FFFFFF | #0F172A | #2563EB |
| Dark | #0B1220 | #E5E7EB | #60A5FA |

### Typography
- **Body:** Inter (clean, professional)
- **Code:** JetBrains Mono
- **Urdu:** Noto Nastaliq Urdu

### Key UI Components
1. **Floating Chatbot** - Bottom-right, always accessible
2. **Chapter Actions** - Top of each chapter (Personalize + Translate)
3. **Auth Modal** - Multi-step signup with skill questions

---

## 🚀 Deployment (Vercel)

### Environment Variables Needed:
```
GEMINI_API_KEY=your_api_key_here
```

### Vercel Setup:
1. Import GitHub repo: `maazwaqar33/AIbook`
2. Add Environment Variable: `GEMINI_API_KEY`
3. Deploy

### URLs After Deployment:
- **Frontend:** `https://aibook-xxx.vercel.app/`
- **API:** `https://aibook-xxx.vercel.app/api/`

---

## 📁 Project Structure

```
f:\aibook\
├── docs/                           # 8 Chapters of content
│   ├── chapter-01-introduction/
│   ├── chapter-02-foundations/
│   ├── chapter-03-hardware/
│   ├── chapter-04-kinematics/
│   ├── chapter-05-ai/
│   ├── chapter-06-perception/
│   ├── chapter-07-humanoids/
│   └── chapter-08-capstone/
│
├── src/
│   ├── components/
│   │   ├── ChatbotWidget/          # RAG chatbot UI
│   │   ├── ChapterActions/         # Personalize + Translate buttons
│   │   ├── AuthModal/              # Signup/login modal
│   │   └── NavbarAuthButton/       # Auth button in navbar
│   ├── css/custom.css              # Academic color theme
│   └── theme/Root.tsx              # Global component wrapper
│
├── backend/
│   ├── main.py                     # FastAPI endpoints
│   ├── config.py                   # Settings + env vars
│   └── services/
│       ├── rag_service.py          # Chatbot logic
│       ├── translation_service.py  # Urdu translation
│       └── personalization_service.py
│
├── vercel.json                     # Vercel deployment config
└── package.json
```

---

## ✅ Hackathon Checklist

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Docusaurus textbook | ✅ | 8 chapters, 39 files |
| RAG Chatbot | ✅ | POST /api/chat |
| Selected text mode | ✅ | POST /api/chat/selected |
| FastAPI backend | ✅ | backend/main.py |
| Claude subagents | ✅ | .agent/skills/*.md |
| User authentication | ✅ | AuthModal component |
| Personalization | ✅ | Gemini-powered |
| Urdu translation | ✅ | Gemini-powered |
| Graceful errors | ✅ | User-friendly messages |

---

## 🎯 Demo Script (2-3 Minutes)

### Scene 1: Introduction (20s)
"This is my Physical AI & Humanoid Robotics textbook, built with Docusaurus and powered by Google Gemini AI."

### Scene 2: RAG Chatbot (40s)
"Let me ask the AI tutor a question..."
- Click chatbot
- Ask about Physical AI
- Show response with sources

### Scene 3: Selected Text (30s)
"I can also ask about specific text..."
- Highlight text
- Ask for simpler explanation

### Scene 4: Personalization (30s)
"The book adapts to my skill level..."
- Show beginner profile
- Click personalize
- Show adapted content

### Scene 5: Translation (20s)
"I can also read in Urdu..."
- Click اردو
- Show RTL translation

### Scene 6: Closing (10s)
"Built with Docusaurus, FastAPI, and Gemini AI. Ready for deployment on Vercel."

---

## 📋 Error Handling

All services now have graceful error handling:

| Error Type | User Message |
|------------|--------------|
| Quota exceeded | ⏳ Service is busy. Please wait a moment. |
| API key issue | 🔑 API configuration issue. |
| Timeout | ⏱️ Request timed out. Please try again. |
| Generic error | 😅 Sorry, encountered an issue. |

---

## 🔗 Links

- **GitHub:** https://github.com/maazwaqar33/AIbook
- **Gemini API Key:** https://aistudio.google.com/app/apikey
- **Vercel:** https://vercel.com/new