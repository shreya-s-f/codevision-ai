# CodeVision.ai — AI Code Review Assistant

> **Department of Information Science & Engineering**  
> **Basaveshwar Engineering College (Autonomous), Bagalkote – 587 103**  
> **Course Project**: 22UIS717P | **Academic Year**: 2025–2026  
> **Project Title**: CodeVision.ai — AI-Powered Automated Code Review and Testing Assistant

---

## 🚀 Overview

**CodeVision.ai** is an intelligent, full-stack automated code review and testing assistant designed to help software engineers write cleaner, more secure, and higher-quality code. It integrates:

1. **Deterministic Static Analysis**: Instant pattern detection for security vulnerabilities (SQL injection, hardcoded secrets, arbitrary eval), bug risks (potential division by zero, unhandled exceptions), and code quality metrics.
2. **LLM Reasoning Engine**: Context-aware synthesis that explains issues in clear English, recommends optimal patches, and auto-generates unit test cases.
3. **Interactive 6-Screen Modern UI**:
   - **Screen 1**: Premium Animated Opening Intro (`CodeVision.ai` reveal & progress sequence)
   - **Screen 2**: Hero Landing Page (`AI Code Review Assistant`, 3D interactive code panel, 4-pill feature strip, 5-step plain English workflow)
   - **Screen 3**: Split Auth Page (Left: branding & 4 value pills; Right: Login/Register, Social sign-in buttons, Demo access)
   - **Screen 4**: Dashboard (Live metrics, 4 stat cards, Recent Activity list, Keep Improving card)
   - **Screen 5**: Code Review & Analyzer (Line-numbered editor, language selector, High/Low severity issue cards, 1-click **Apply Fix**, auto-generated test cases)
   - **Screen 6**: Landing Features & College Project Attribution

---

## 🛠️ Technology Stack (Strictly Aligned with Project Synopsis)

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite, Framer Motion, Lucide Icons
- **Backend**: FastAPI (Python 3.10+), Uvicorn ASGI Server
- **Database & ORM**: SQLite (development), SQLAlchemy ORM (PostgreSQL-ready)
- **Security & Authentication**: JWT (JSON Web Tokens), Passlib (Bcrypt hashing)
- **Design System**: Light Blue (`#38bdf8`), Light Purple (`#c084fc`), White & Deep Space Dark theme, Google Fonts (`Space Grotesk`, `Inter`, `JetBrains Mono`)

---

## ⚡ Quick Start Guide

### 1. Run Backend Server (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
- API Base URL: `http://127.0.0.1:8000`
- Interactive Swagger API Docs: `http://127.0.0.1:8000/docs`

### 2. Run Frontend Application (React + Vite)
```bash
cd codevision-ai
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```
- Open your browser at: `http://127.0.0.1:5173`

---

## 🧪 Automated Testing

To run the end-to-end backend integration tests:
```bash
cd backend
python test_e2e.py
```

To run the frontend production build verification:
```bash
cd codevision-ai
npm run build
```
