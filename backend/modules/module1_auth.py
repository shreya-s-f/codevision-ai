import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from database import get_db
import models
import auth

router = APIRouter(prefix="/auth", tags=["Module 1: Authentication & User Management"])

COLLEGE_METADATA = {
    "institution": "B. V. V. Sangha's Basaveshwar Engineering College Bagalkote",
    "department": "Department of Information Science and Engineering",
    "semester": "7th Semester",
    "academic_year": "2026-27",
    "course_code": "22UIS717P",
    "project_title": "CodeVision.ai : AI Code Review Assistant",
    "project_guide": {
        "name": "Prof. Deepa I.K.",
        "designation": "Assistant Professor",
        "department": "Department of Information Science and Engineering"
    },
    "project_associates": [
        {"sl_no": 1, "usn": "2BA23IS073", "name": "Ranjita Benakatti", "role": "Full-Stack & Security Engineer"},
        {"sl_no": 2, "usn": "2BA23IS088", "name": "Shreya Suresh Fakirapur", "role": "Lead Architect & AI Systems"},
        {"sl_no": 3, "usn": "2BA24IS407", "name": "Prajwal Joshi", "role": "Backend & Cloud Architect"},
        {"sl_no": 4, "usn": "2BA24IS408", "name": "Preetam Joshi", "role": "QA & DevOps Lead"}
    ]
}

@router.get("/info")
def get_module1_info():
    return {
        "module_id": "MOD-01",
        "name": "User Authentication & Workspace Management",
        "status": "active",
        "spec_reference": "Synopsis 22UIS717P - Section 7 System Workflow (Step 1)",
        "features": [
            "JWT Bearer Token Generation & Validation",
            "Role-Based Access Control (Admin, Lead Reviewer, Developer)",
            "Secure SHA-256 with dynamic salt hashing",
            "Project Associate and Academic Credential Linking"
        ],
        "metadata": COLLEGE_METADATA
    }

@router.get("/associates")
def get_project_associates():
    return COLLEGE_METADATA

@router.post("/test-ping")
def test_auth_ping(token: Optional[str] = None):
    return {
        "success": True,
        "module": "MOD-01: Authentication",
        "message": "Auth micro-service is responding. JWT validation engine online.",
        "token_provided": bool(token),
        "timestamp": "2026-09-24T21:25:00Z"
    }
