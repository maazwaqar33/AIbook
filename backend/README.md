---
title: Physical AI Textbook API
emoji: 🤖
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
license: mit
app_port: 7860
---

# Physical AI Textbook - RAG Chatbot API

This is the backend API for the Physical AI & Humanoid Robotics Textbook.

## Endpoints

- `POST /api/chat` - General chat with RAG
- `POST /api/chat/selected` - Chat about selected text
- `POST /api/translate` - Translate to Urdu
- `POST /api/personalize` - Personalize content

## Environment Variables

Set `GEMINI_API_KEY` in the Space settings.
