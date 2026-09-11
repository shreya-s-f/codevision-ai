@echo off
echo ========================================================
echo        Starting CodeVision.ai Full-Stack Services
echo ========================================================
echo.
echo [1/2] Starting Backend API Server (FastAPI on Port 8000)...
start "CodeVision Backend (FastAPI)" cmd /k "cd backend && python -m uvicorn main:app --reload --port 8000"

echo [2/2] Starting Frontend App (Vite on Port 5173)...
start "CodeVision Frontend (Vite)" cmd /k "cd codevision-ai && npm run dev"

echo.
echo ========================================================
echo  All services started!
echo  - Frontend: http://localhost:5173
echo  - Backend Docs: http://localhost:8000/docs
echo ========================================================
timeout /t 3 >nul
start http://localhost:5173
