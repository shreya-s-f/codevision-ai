import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/ingestion", tags=["Module 2: Source Code Ingestion & Preprocessing"])

class IngestRequest(BaseModel):
    code: str
    filename: Optional[str] = "main.py"
    language: Optional[str] = "python"

SAMPLE_SNIPPETS = [
    {
        "id": "sample-calc",
        "title": "Division by Zero & Missing Types (Python)",
        "filename": "calculate.py",
        "language": "python",
        "description": "Academic benchmark snippet exhibiting boundary condition flaw and untyped parameters.",
        "code": "def calculate(a, b):\n    if b == 0:\n        return \"Error\"\n    return a / b\n\nresult = calculate(10, 0)\nprint(result)"
    },
    {
        "id": "sample-sql",
        "title": "SQL Injection & Secret Exposure (Python)",
        "filename": "database_service.py",
        "language": "python",
        "description": "Database query builder vulnerable to user input concatenation and exposed API secret token.",
        "code": "import sqlite3\n\nAPI_KEY = \"sk_live_98472918471209384\"\n\ndef get_user_profile(user_input_id):\n    conn = sqlite3.connect('app.db')\n    query = \"SELECT * FROM users WHERE id = '\" + user_input_id + \"'\"\n    return conn.execute(query).fetchall()"
    },
    {
        "id": "sample-xss",
        "title": "DOM-Based Cross-Site Scripting (TypeScript/React)",
        "filename": "UserProfile.tsx",
        "language": "typescript",
        "description": "Direct injection of untrusted user HTML into the document object model.",
        "code": "import React from 'react';\n\nexport const UserBio = ({ bioHtml }: { bioHtml: string }) => {\n  // Insecure direct injection without sanitization\n  return <div dangerouslySetInnerHTML={{ __html: bioHtml }} />;\n};"
    },
    {
        "id": "sample-java",
        "title": "Resource Leak & Insecure Randomness (Java)",
        "filename": "PaymentCrypto.java",
        "language": "java",
        "description": "Unclosed stream leading to file descriptor exhaustion and weak PRNG for token generation.",
        "code": "import java.util.Random;\nimport java.io.FileInputStream;\n\npublic class PaymentCrypto {\n    public static int generateToken() {\n        Random rand = new Random(); // Weak PRNG\n        return rand.nextInt(999999);\n    }\n}"
    }
]

@router.get("/info")
def get_module2_info():
    return {
        "module_id": "MOD-02",
        "name": "Source Code Ingestion & Preprocessing",
        "status": "active",
        "spec_reference": "Synopsis 22UIS717P - Section 7 System Workflow (Steps 2 & 3)",
        "features": [
            "Source Code Text Ingestion & Multi-Language Detection",
            "File Preprocessing, Normalization & Comment Stripping",
            "Token & Line Complexity Pre-Calculations",
            "Syntax Tree Preparation for Static & Neural Analysis"
        ],
        "supported_languages": ["Python", "JavaScript", "TypeScript", "Java", "C++", "Go", "PHP", "HTML/CSS"]
    }

@router.get("/samples")
def get_sample_snippets():
    return SAMPLE_SNIPPETS

@router.post("/preprocess")
def preprocess_source_code(req: IngestRequest):
    lines = req.code.splitlines()
    total_lines = len(lines)
    blank_lines = sum(1 for line in lines if not line.strip())
    comment_lines = sum(1 for line in lines if line.strip().startswith(("#", "//", "/*", "*")))
    code_lines = total_lines - blank_lines - comment_lines
    character_count = len(req.code)

    # Simple heuristic language confirmation
    lang_detected = req.language or "python"
    if "def " in req.code or "import " in req.code and "{" not in req.code:
        lang_detected = "python"
    elif "interface " in req.code or "const " in req.code or "export " in req.code:
        lang_detected = "typescript"
    elif "public class " in req.code or "System.out.println" in req.code:
        lang_detected = "java"

    return {
        "success": True,
        "filename": req.filename,
        "language_detected": lang_detected,
        "metrics": {
            "total_lines": total_lines,
            "code_lines": max(code_lines, 1),
            "blank_lines": blank_lines,
            "comment_lines": comment_lines,
            "character_count": character_count
        },
        "status": "preprocessed_ready_for_pipeline",
        "pipeline_target": "MOD-03: Static Analysis"
    }
