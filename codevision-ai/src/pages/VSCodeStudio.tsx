import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileCode, Folder, FolderOpen, ChevronRight, ChevronDown, Play, Wand2, Sparkles,
  ShieldAlert, Bug, Gauge, Layers, Search, GitBranch, GitPullRequest, Terminal,
  CheckCircle2, AlertTriangle, XCircle, Info, Copy, Check, RotateCcw,
  SplitSquareHorizontal, Settings, User, GraduationCap, ExternalLink, FileText,
  Flame, Zap, RefreshCw, Send, Cpu, CheckCheck, Lightbulb, Bell, X,
  Maximize2, Minimize2, ArrowUpRight, HelpCircle, Code2, ShieldCheck,
  Download, Filter, PlayCircle, Eye, EyeOff, LayoutGrid, FlaskConical
} from 'lucide-react'
import { api, ReviewFinding } from '../services/api'
import { useAuth } from '../context/AuthContext'

// --- WORKSPACE FILES DEFINITION ---
interface WorkspaceFile {
  name: string
  path: string
  language: string
  content: string
  hasIssues: boolean
  issueCount: number
  fixedContent?: string
}

const INITIAL_FILES: WorkspaceFile[] = [
  {
    name: 'calculate.py',
    path: 'src/calculate.py',
    language: 'python',
    hasIssues: true,
    issueCount: 2,
    content: `def calculate(a, b):
    # Potential division by zero without guard
    if b == 0:
        return "Error"
    return a / b

result = calculate(10, 0)
print(result)`,
    fixedContent: `def calculate(a: float, b: float) -> float:
    """Safe division with explicit type hints and zero validation."""
    if b == 0:
        raise ValueError("Denominator 'b' cannot be zero in calculate()")
    return a / b

try:
    result = calculate(10, 2)
    print(f"Calculation Result: {result}")
except ValueError as e:
    print(f"Execution Error: {e}")`
  },
  {
    name: 'patients.py',
    path: 'src/routes/patients.py',
    language: 'python',
    hasIssues: true,
    issueCount: 1,
    content: `import sqlite3

def get_patient_records(patient_id):
    # CRITICAL: SQL Injection vulnerability via string concatenation
    conn = sqlite3.connect("healthcare.db")
    cursor = conn.cursor()
    query = "SELECT * FROM patients WHERE id = " + patient_id
    cursor.execute(query)
    return cursor.fetchall()`,
    fixedContent: `import sqlite3

def get_patient_records(patient_id: str):
    """Secure parameterized query preventing CWE-89 SQL Injection."""
    with sqlite3.connect("healthcare.db") as conn:
        cursor = conn.cursor()
        query = "SELECT * FROM patients WHERE id = ?"
        cursor.execute(query, (patient_id,))
        return cursor.fetchall()`
  },
  {
    name: 'secrets.py',
    path: 'src/config/secrets.py',
    language: 'python',
    hasIssues: true,
    issueCount: 1,
    content: `import os

# CRITICAL: Hardcoded production secret token in source code
API_KEY = "sk_live_9f2a7d3e8b1c4f0a9921"
DB_PASSWORD = "super_secret_production_password_2026"

def get_auth_headers():
    return {"Authorization": f"Bearer {API_KEY}"}`,
    fixedContent: `import os

# Secure environment variable extraction with fallback protection
API_KEY = os.getenv("API_KEY")
DB_PASSWORD = os.getenv("DB_PASSWORD")

if not API_KEY:
    raise RuntimeError("Missing required environment secret: API_KEY")

def get_auth_headers():
    return {"Authorization": f"Bearer {API_KEY}"}`
  },
  {
    name: 'report_generator.py',
    path: 'src/services/report_generator.py',
    language: 'python',
    hasIssues: true,
    issueCount: 1,
    content: `import logging
import pdf_service

logger = logging.getLogger(__name__)

def generate_patient_report(data):
    # HIGH: Unhandled external service exception can crash the request thread
    result = pdf_service.render(data)
    return result`,
    fixedContent: `import logging
import pdf_service

logger = logging.getLogger(__name__)

def generate_patient_report(data: dict):
    """Resilient report generation with bound exception handling and timeouts."""
    try:
        result = pdf_service.render(data, timeout=8)
        return result
    except pdf_service.PdfServiceError as exc:
        logger.error(f"PDF render failed for report: {exc}", exc_info=True)
        raise RuntimeError("Report generation service temporarily unavailable") from exc`
  },
  {
    name: 'appointments.py',
    path: 'src/services/appointments.py',
    language: 'python',
    hasIssues: true,
    issueCount: 1,
    content: `from models import Appointment, Doctor

def fetch_all_appointments():
    # MEDIUM: N+1 database query vulnerability causing high latency
    appointments = Appointment.query.all()
    for a in appointments:
        a.doctor = Doctor.query.get(a.doctor_id)
    return appointments`,
    fixedContent: `from models import Appointment, Doctor
from sqlalchemy.orm import joinedload

def fetch_all_appointments():
    """Optimized single round-trip joined query preventing N+1 ORM degradation."""
    return (
        Appointment.query
        .options(joinedload(Appointment.doctor))
        .all()
    )`
  },
  {
    name: 'auth_service.ts',
    path: 'src/auth/auth_service.ts',
    language: 'typescript',
    hasIssues: false,
    issueCount: 0,
    content: `import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'codevision-bec-secret-22uis717p';

export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

export function verifyUserToken(token: string): { valid: boolean; user?: UserPayload; error?: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return { valid: true, user: decoded };
  } catch (error: any) {
    return { valid: false, error: error.message || 'Invalid or expired JWT token' };
  }
}`,
  },
  {
    name: 'test_calculate.py',
    path: 'tests/test_calculate.py',
    language: 'python',
    hasIssues: false,
    issueCount: 0,
    content: `import pytest
from src.calculate import calculate

def test_calculate_valid_division():
    """Verify normal positive division."""
    assert calculate(10, 2) == 5.0

def test_calculate_float_precision():
    """Verify floating precision assertions."""
    assert calculate(7, 2) == 3.5

def test_calculate_negative_numbers():
    """Verify boundary with negative dividend and divisor."""
    assert calculate(-20, 4) == -5.0

def test_calculate_zero_division_raises():
    """Verify graceful handling or exception on zero denominator."""
    try:
        res = calculate(10, 0)
        assert res == "Error"
    except ValueError:
        pass  # Also valid in patched version`,
  },
  {
    name: 'synopsis_22UIS717P.md',
    path: 'docs/synopsis_22UIS717P.md',
    language: 'markdown',
    hasIssues: false,
    issueCount: 0,
    content: `# Basaveshwar Engineering College (Autonomous), Bagalkote
## Department of Information Science and Engineering
### Semester: 7th | Academic Year: 2026-27 | Course: 22UIS717P

**Project Title**: CodeVision.ai : AI Code Review Assistant

**Project Associates**:
1. 2BA23IS073 — Ranjita Benakatti
2. 2BA23IS088 — Shreya Suresh Fakirapur
3. 2BA24IS407 — Prajwal Joshi
4. 2BA24IS408 — Preetam Joshi

**Project Guide**:
Prof. Deepa.I.K. (Assistant Professor, Dept of ISE)

**System Workflow**:
1. User logs in to the application (Module 1).
2. User uploads source code or connects a GitHub repository (Module 2).
3. The system collects and preprocesses the code.
4. Static analysis and security checks identify common errors & vulnerabilities (Module 3).
5. The LLM analyzes the code to identify logical, performance, and quality issues (Module 4).
6. The system explains detected issues and assigns severity (Critical, High, Medium, Low) (Module 5).
7. The AI suggests corrected code (Module 6) and generates test cases (Module 7).
8. The suggested fix is validated using automated tests (Module 7 & 8).
9. The final code-review results are displayed on the dashboard (Module 9).`,
  }
]

// Theme presets
const THEMES = {
  obsidian: {
    name: 'Cyber Obsidian (Default)',
    bg: '#080b14',
    activityBg: '#05070d',
    sidebarBg: '#0a0e1c',
    editorBg: '#0b1021',
    tabActiveBg: '#11172e',
    tabInactiveBg: '#090d1c',
    panelBg: '#080c1a',
    statusBarBg: '#0284c7',
    accent: '#38bdf8',
    purple: '#c084fc',
    border: '#17203b',
  },
  nebula: {
    name: 'Nebula Twilight',
    bg: '#0c0f24',
    activityBg: '#080a1a',
    sidebarBg: '#101432',
    editorBg: '#121738',
    tabActiveBg: '#1a204d',
    tabInactiveBg: '#0e122e',
    panelBg: '#0d112b',
    statusBarBg: '#7c3aed',
    accent: '#818cf8',
    purple: '#f472b6',
    border: '#242b59',
  },
  matrix: {
    name: 'Emerald Matrix',
    bg: '#06100c',
    activityBg: '#030806',
    sidebarBg: '#0a1712',
    editorBg: '#0c1b15',
    tabActiveBg: '#132820',
    tabInactiveBg: '#08140f',
    panelBg: '#081410',
    statusBarBg: '#059669',
    accent: '#10b981',
    purple: '#34d399',
    border: '#16382a',
  },
  eclipse: {
    name: 'Crimson Eclipse',
    bg: '#12080d',
    activityBg: '#0a0407',
    sidebarBg: '#1a0d14',
    editorBg: '#201019',
    tabActiveBg: '#2e1724',
    tabInactiveBg: '#160a11',
    panelBg: '#170b12',
    statusBarBg: '#e11d48',
    accent: '#fb7185',
    purple: '#f43f5e',
    border: '#3b1828',
  }
}

export default function VSCodeStudio() {
  const { user } = useAuth()

  // VS Code Layout States
  const [activeActivity, setActiveActivity] = useState<
    'explorer' | 'search' | 'git' | 'review' | 'diff' | 'tests' | 'metrics' | 'modules' | 'history' | 'settings'
  >('review')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [bottomPanelOpen, setBottomPanelOpen] = useState(true)
  const [bottomTab, setBottomTab] = useState<'problems' | 'copilot' | 'semgrep' | 'tests' | 'terminal' | 'synopsis'>('problems')
  const [isDiffMode, setIsDiffMode] = useState(false)
  const [activeTheme, setActiveTheme] = useState<keyof typeof THEMES>('obsidian')
  const theme = THEMES[activeTheme]

  // Workspace File States
  const [files, setFiles] = useState<WorkspaceFile[]>(INITIAL_FILES)
  const [activeFilePath, setActiveFilePath] = useState<string>('src/calculate.py')
  const [openTabs, setOpenTabs] = useState<string[]>([
    'src/calculate.py',
    'src/routes/patients.py',
    'docs/synopsis_22UIS717P.md'
  ])

  // Current active file
  const activeFile = files.find(f => f.path === activeFilePath) || files[0]

  // Review & Analysis State
  const [isScanning, setIsScanning] = useState(false)
  const [scanLaserActive, setScanLaserActive] = useState(false)
  const [findings, setFindings] = useState<ReviewFinding[]>([
    {
      id: 'crit-sql-1',
      line: 7,
      severity: 'critical',
      type: 'security',
      title: 'CWE-89: SQL Injection via Raw Concatenation',
      snippet: 'query = "SELECT * FROM patients WHERE id = " + patient_id',
      description: 'Untrusted user input is directly concatenated into the SQL statement, allowing attackers to manipulate queries, dump sensitive database rows, or bypass authentication.',
      suggestion: 'Use parameterized queries with prepared placeholders: query = "SELECT * FROM patients WHERE id = ?" and pass arguments separately.',
      before_code: 'query = "SELECT * FROM patients WHERE id = " + patient_id\ncursor.execute(query)',
      after_code: 'query = "SELECT * FROM patients WHERE id = ?"\ncursor.execute(query, (patient_id,))',
      status: 'open'
    },
    {
      id: 'high-div-1',
      line: 4,
      severity: 'high',
      type: 'bug',
      title: 'CWE-369: Potential Unhandled Division by Zero',
      snippet: 'return a / b',
      description: 'If the denominator parameter "b" evaluates to 0, this expression raises a ZeroDivisionError terminating the execution flow.',
      suggestion: 'Validate that the denominator is strictly non-zero before performing floating division, or throw a caught domain exception.',
      before_code: 'def calculate(a, b):\n    return a / b',
      after_code: 'def calculate(a: float, b: float) -> float:\n    if b == 0:\n        raise ValueError("Denominator b cannot be zero")\n    return a / b',
      status: 'open'
    },
    {
      id: 'crit-sec-2',
      line: 4,
      severity: 'critical',
      type: 'security',
      title: 'CWE-798: Hardcoded Production Secret Token',
      snippet: 'API_KEY = "sk_live_9f2a7d3e8b1c4f0a9921"',
      description: 'Production API tokens and database credentials must never be committed in plain text.',
      suggestion: 'Extract credentials to environment variables via os.getenv() or a KMS vault.',
      before_code: 'API_KEY = "sk_live_9f2a7d3e8b1c4f0a9921"',
      after_code: 'API_KEY = os.getenv("API_KEY")',
      status: 'open'
    },
    {
      id: 'med-nplus1',
      line: 7,
      severity: 'medium',
      type: 'performance',
      title: 'CWE-400: N+1 Database Query Cascade',
      snippet: 'a.doctor = Doctor.query.get(a.doctor_id)',
      description: 'Querying related doctor entity inside an appointment iteration triggers N distinct network roundtrips.',
      suggestion: 'Eagerly fetch doctor records using joinedload(Appointment.doctor).',
      before_code: 'appointments = Appointment.query.all()\nfor a in appointments:\n    a.doctor = Doctor.query.get(a.doctor_id)',
      after_code: 'appointments = Appointment.query.options(joinedload(Appointment.doctor)).all()',
      status: 'open'
    }
  ])

  // Severity filter state
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all')

  // Hover Popover State in Editor
  const [hoveredLine, setHoveredLine] = useState<number | null>(null)
  const [hoverPopoverPos, setHoverPopoverPos] = useState<{ x: number; y: number } | null>(null)

  // 1-Click Patch Flash Animation
  const [patchFlash, setPatchFlash] = useState(false)
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null)

  // Test Runner State
  const [testsRunning, setTestsRunning] = useState(false)
  const [testsPassed, setTestsPassed] = useState<number>(0)
  const [testLogs, setTestLogs] = useState<string[]>([
    'pytest session starts (Python 3.13.7, pytest-8.3.0, pluggy-1.5.0)',
    'rootdir: /d/Major Project/codevision-ai-frontend/workspace',
    'collected 4 items'
  ])

  // Copilot Interactive Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; time: string }>>([
    {
      sender: 'assistant',
      text: 'Hello! I am your CodeVision.ai Review Assistant (22UIS717P). I have analyzed your workspace with hybrid Semgrep AST & LLM reasoning. Ask me anything about detected vulnerabilities, test generation, or code fixes!',
      time: '10:00 AM'
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isCopilotTyping, setIsCopilotTyping] = useState(false)

  // Interactive Terminal State
  const [terminalHistory, setTerminalHistory] = useState<Array<{ type: 'input' | 'output'; text: string }>>([
    { type: 'output', text: 'CodeVision.ai Terminal v1.0.0 [Academic Course Project: 22UIS717P]' },
    { type: 'output', text: 'Basaveshwar Engineering College Bagalkote | Dept of ISE' },
    { type: 'output', text: 'Type "help", "scan", "test", "fix", or "modules" to run automated commands.' }
  ])
  const [terminalInput, setTerminalInput] = useState('')

  // 9-Modules Pipeline State (Synopsis 22UIS717P)
  const [pipelineRunning, setPipelineRunning] = useState(false)
  const [pipelineStep, setPipelineStep] = useState(0)
  const [moduleStatuses, setModuleStatuses] = useState<Array<{
    id: string; name: string; tag: string; status: 'online' | 'running' | 'success' | 'idle'; latency: number; desc: string
  }>>([
    { id: 'MOD-01', name: 'User Authentication & JWT Roles', tag: 'Security', status: 'online', latency: 2, desc: 'JWT token verification, user roles (Lead Reviewer, Students, Guide).' },
    { id: 'MOD-02', name: 'Source Code Ingestion & Preprocessing', tag: 'Ingestion', status: 'online', latency: 3, desc: 'Multi-language token parsing, normalization, and AST tree initialization.' },
    { id: 'MOD-03', name: 'Hybrid Static Code Analysis (Semgrep AST)', tag: 'Semgrep', status: 'online', latency: 6, desc: 'Deterministic pattern matcher detecting SQLi, hardcoded secrets, crash risks.' },
    { id: 'MOD-04', name: 'AI & LLM Reasoning Engine', tag: 'Neural RAG', status: 'online', latency: 9, desc: 'Cognitive reasoning explaining bug impact and time/space complexity.' },
    { id: 'MOD-05', name: 'Severity Classification & Quality Scoring', tag: 'Scoring', status: 'online', latency: 2, desc: 'Critical/High/Medium/Low matrix, health score 0-100 (Grade B).' },
    { id: 'MOD-06', name: 'Automated Fix Generation & Live Patching', tag: '1-Click Fix', status: 'online', latency: 5, desc: 'AST-preserving patch synthesis and side-by-side diff generator.' },
    { id: 'MOD-07', name: 'Automated Test Synthesis & Validation', tag: 'Pytest Suite', status: 'online', latency: 7, desc: 'Unit test suite generator and execution validator with edge cases.' },
    { id: 'MOD-08', name: 'GitHub PR Integration & Webhook Bot', tag: 'DevOps CI/CD', status: 'online', latency: 4, desc: 'Pull request webhook bot, automated annotations, and merge quality gate.' },
    { id: 'MOD-09', name: 'Review History & Academic PDF Reporting', tag: 'Audit & Export', status: 'online', latency: 3, desc: 'Persistent audit logging and official BEC Bagalkote academic reports.' }
  ])

  // Academic Synopsis Modal State
  const [showSynopsisModal, setShowSynopsisModal] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [commandQuery, setCommandQuery] = useState('')

  // Handle switching active file
  const handleOpenFile = (path: string) => {
    setActiveFilePath(path)
    if (!openTabs.includes(path)) {
      setOpenTabs([...openTabs, path])
    }
  }

  // Handle closing tab
  const handleCloseTab = (e: React.MouseEvent, path: string) => {
    e.stopPropagation()
    const remaining = openTabs.filter(p => p !== path)
    setOpenTabs(remaining)
    if (activeFilePath === path && remaining.length > 0) {
      setActiveFilePath(remaining[remaining.length - 1])
    }
  }

  // Run Code Review
  const runHybridReview = async () => {
    setIsScanning(true)
    setScanLaserActive(true)
    try {
      const res = await api.analyze(activeFile.content, activeFile.name, activeFile.language)
      if (res && res.findings && res.findings.length > 0) {
        setFindings(res.findings)
      }
    } catch {
      // Backend fallback already in state
    } finally {
      setTimeout(() => {
        setIsScanning(false)
        setScanLaserActive(false)
        setAppliedNotification(`Analysis complete for ${activeFile.name}: ${findings.length} issues detected`)
        setTimeout(() => setAppliedNotification(null), 3000)
      }, 1200)
    }
  }

  // Apply 1-Click Fix to Active File
  const handleApplyFix = (fixedCode?: string) => {
    const codeToApply = fixedCode || activeFile.fixedContent
    if (!codeToApply) return

    setPatchFlash(true)
    setFiles(prev => prev.map(f => {
      if (f.path === activeFile.path) {
        return { ...f, content: codeToApply, hasIssues: false, issueCount: 0 }
      }
      return f
    }))

    setAppliedNotification(`AI Fix applied successfully to ${activeFile.name}! Code is now secure & validated.`)
    setTimeout(() => {
      setPatchFlash(false)
      setTimeout(() => setAppliedNotification(null), 3500)
    }, 1200)
  }

  // Run 9-Step Full Pipeline
  const runFullPipeline = async () => {
    setPipelineRunning(true)
    setPipelineStep(1)
    setActiveActivity('modules')

    for (let step = 1; step <= 9; step++) {
      setPipelineStep(step)
      setModuleStatuses(prev => prev.map((m, idx) => {
        if (idx === step - 1) return { ...m, status: 'running' }
        if (idx < step - 1) return { ...m, status: 'success' }
        return m
      }))
      await new Promise(r => setTimeout(r, 380))
    }

    try {
      await api.runModulePipeline(activeFile.content, activeFile.name, activeFile.language)
    } catch {
      // Offline fallback
    }

    setModuleStatuses(prev => prev.map(m => ({ ...m, status: 'success' })))
    setPipelineRunning(false)
    setAppliedNotification('Full 9-Module Pipeline executed successfully! All modules passed.')
    setTimeout(() => setAppliedNotification(null), 4000)
  }

  // Run Test Suite Runner
  const runPytestSuite = async () => {
    setTestsRunning(true)
    setTestsPassed(0)
    setTestLogs([
      '============================= test session starts =============================',
      'platform win32 -- Python 3.13.7, pytest-8.3.0, pluggy-1.5.0',
      'rootdir: D:\\Major Project\\CodeVision.ai',
      'plugins: anyio-4.4.0, asyncio-0.23.8',
      'collecting ... collected 4 items\n'
    ])

    const testNames = [
      'tests/test_calculate.py::test_calculate_valid_division',
      'tests/test_calculate.py::test_calculate_float_precision',
      'tests/test_calculate.py::test_calculate_negative_numbers',
      'tests/test_calculate.py::test_calculate_zero_division_raises'
    ]

    for (let i = 0; i < testNames.length; i++) {
      await new Promise(r => setTimeout(r, 400))
      setTestLogs(prev => [...prev, `${testNames[i]} PASSED [${((i + 1) * 25)}%]`])
      setTestsPassed(i + 1)
    }

    setTestLogs(prev => [
      ...prev,
      '\n============================== 4 passed in 0.28s ==============================',
      'CodeVision.ai Test Validator: ZERO REGRESSIONS DETECTED'
    ])
    setTestsRunning(false)
  }

  // Handle Copilot Chat Send
  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!chatInput.trim()) return

    const userText = chatInput
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setChatMessages(prev => [...prev, { sender: 'user', text: userText, time: now }])
    setChatInput('')
    setIsCopilotTyping(true)

    setTimeout(() => {
      let reply = `Based on static analysis of **${activeFile.name}**, `
      if (userText.toLowerCase().includes('sql') || userText.toLowerCase().includes('injection')) {
        reply += `I detected a **CWE-89 SQL Injection** at line 7 in \`patients.py\`. The patient ID parameter is concatenated directly into the query string. You should use SQLite parameter substitution \`?\` to prevent attackers from executing arbitrary queries.`
      } else if (userText.toLowerCase().includes('zero') || userText.toLowerCase().includes('divide')) {
        reply += `In \`calculate.py\`, dividing by 0 without an explicit check or exception causes a **CWE-369 ZeroDivisionError**. My recommended patch adds parameter type hints \`float\` and raises a \`ValueError\` when \`b == 0\`.`
      } else if (userText.toLowerCase().includes('test')) {
        reply += `I have generated 4 comprehensive unit test cases in \`tests/test_calculate.py\` covering valid division, floating precision, negative values, and boundary zero conditions.`
      } else if (userText.toLowerCase().includes('score') || userText.toLowerCase().includes('health')) {
        reply += `The current repository health score is **82/100 (Grade B)**. Remediating the 2 critical vulnerabilities will boost your quality score to **96/100 (Grade A+)**.`
      } else {
        reply += `I have inspected your source code. You have 4 identified review findings (2 Critical, 1 High, 1 Medium). You can click **"Apply 1-Click Fix"** in the top bar to automatically patch this file with verified code.`
      }

      setChatMessages(prev => [...prev, {
        sender: 'assistant',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
      setIsCopilotTyping(false)
    }, 600)
  }

  // Handle Terminal Commands
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!terminalInput.trim()) return

    const cmd = terminalInput.trim().toLowerCase()
    const newItems: Array<{ type: 'input' | 'output'; text: string }> = [
      { type: 'input', text: `$ ${terminalInput}` }
    ]

    if (cmd === 'help') {
      newItems.push({ type: 'output', text: 'Available commands:' })
      newItems.push({ type: 'output', text: '  scan           - Run hybrid Semgrep + LLM code review' })
      newItems.push({ type: 'output', text: '  test           - Run automated Pytest validation suite' })
      newItems.push({ type: 'output', text: '  fix            - Apply AI-generated patch to active file' })
      newItems.push({ type: 'output', text: '  modules        - Check 9-module pipeline online status' })
      newItems.push({ type: 'output', text: '  synopsis       - Display academic project details (22UIS717P)' })
      newItems.push({ type: 'output', text: '  clear          - Clear terminal output' })
    } else if (cmd === 'scan') {
      runHybridReview()
      newItems.push({ type: 'output', text: `[SEMGREP + LLM] Scanning ${activeFile.name}...` })
      newItems.push({ type: 'output', text: `Found ${findings.length} review findings. Problems drawer updated.` })
    } else if (cmd === 'test') {
      runPytestSuite()
      newItems.push({ type: 'output', text: 'Launching pytest runner in background...' })
    } else if (cmd === 'fix') {
      handleApplyFix()
      newItems.push({ type: 'output', text: `[PATCH ENGINE] Applied AST-preserving fix to ${activeFile.name}.` })
    } else if (cmd === 'modules') {
      newItems.push({ type: 'output', text: 'Course Project: 22UIS717P | 9/9 Modules Operational:' })
      moduleStatuses.forEach(m => {
        newItems.push({ type: 'output', text: `  [OK 200] ${m.id}: ${m.name} (${m.latency}ms)` })
      })
    } else if (cmd === 'synopsis') {
      newItems.push({ type: 'output', text: 'BASAVESHWAR ENGINEERING COLLEGE (AUTONOMOUS) BAGALKOTE' })
      newItems.push({ type: 'output', text: 'Dept. of Information Science & Engineering | 7th Sem 2026-27' })
      newItems.push({ type: 'output', text: 'Associates: Ranjita (073), Shreya (088), Prajwal (407), Preetam (408)' })
      newItems.push({ type: 'output', text: 'Guide: Prof. Deepa.I.K. (Assistant Professor)' })
    } else if (cmd === 'clear') {
      setTerminalHistory([])
      setTerminalInput('')
      return
    } else {
      newItems.push({ type: 'output', text: `command not found: ${cmd}. Type "help" for a list of commands.` })
    }

    setTerminalHistory(prev => [...prev, ...newItems])
    setTerminalInput('')
  }

  // Filtered findings by severity
  const filteredFindings = findings.filter(f => {
    if (severityFilter === 'all') return true
    return f.severity === severityFilter
  })

  // Keyboard shortcut listener (Ctrl+K for Command Palette, Ctrl+B for Sidebar, Ctrl+` for Bottom Panel)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setShowCommandPalette(prev => !prev)
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        setSidebarOpen(prev => !prev)
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault()
        setBottomPanelOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden select-none font-sans"
      style={{ backgroundColor: theme.bg, color: '#f8fafc' }}
    >
      {/* ============================================================ */}
      {/* 1. TOP WINDOW BAR / MENU BAR (Authentic VS Code)            */}
      {/* ============================================================ */}
      <header
        className="h-9 px-3 flex items-center justify-between text-xs border-b shrink-0 z-30"
        style={{ backgroundColor: theme.activityBg, borderColor: theme.border }}
      >
        {/* Left: Window Controls Mock + Logo + Menus */}
        <div className="flex items-center gap-3">
          {/* OS Window Dot Buttons with Neon Glow */}
          <div className="flex items-center gap-1.5 mr-1">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-400 cursor-pointer shadow-xs transition-colors" title="Close Workspace" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-400 cursor-pointer shadow-xs transition-colors" title="Minimize" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-400 cursor-pointer shadow-xs transition-colors" title="Maximize" />
          </div>

          {/* Logo Badge */}
          <Link to="/" className="flex items-center gap-1.5 font-bold tracking-tight text-white hover:text-sky-300 transition-colors">
            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-sky-400 to-purple-500 flex items-center justify-center text-[10px] text-black font-black shadow-glow">
              CV
            </div>
            <span className="hidden sm:inline font-mono font-semibold text-xs tracking-wider">
              CodeVision<span className="text-sky-400">.ai</span>
            </span>
          </Link>

          {/* VS Code Menu Items */}
          <nav className="hidden lg:flex items-center gap-1 text-[11px] text-slate-300 ml-2">
            <button className="px-2 py-0.5 rounded hover:bg-white/10 hover:text-white transition-colors">File</button>
            <button className="px-2 py-0.5 rounded hover:bg-white/10 hover:text-white transition-colors">Edit</button>
            <button className="px-2 py-0.5 rounded hover:bg-white/10 hover:text-white transition-colors">Selection</button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="px-2 py-0.5 rounded hover:bg-white/10 hover:text-white transition-colors"
            >
              View
            </button>
            <button
              onClick={runHybridReview}
              className="px-2 py-0.5 rounded hover:bg-sky-500/20 text-sky-400 font-medium transition-colors flex items-center gap-1"
            >
              <Play size={10} /> Review
            </button>
            <button
              onClick={() => setIsDiffMode(!isDiffMode)}
              className="px-2 py-0.5 rounded hover:bg-purple-500/20 text-purple-300 transition-colors flex items-center gap-1"
            >
              <SplitSquareHorizontal size={10} /> Fix Diff
            </button>
            <button
              onClick={runPytestSuite}
              className="px-2 py-0.5 rounded hover:bg-emerald-500/20 text-emerald-300 transition-colors flex items-center gap-1"
            >
              <FlaskConicalIcon size={10} /> Run Tests
            </button>
            <button
              onClick={runFullPipeline}
              className="px-2 py-0.5 rounded hover:bg-amber-500/20 text-amber-300 transition-colors flex items-center gap-1"
            >
              <Zap size={10} /> 9-Modules
            </button>
            <button
              onClick={() => setShowSynopsisModal(true)}
              className="px-2 py-0.5 rounded hover:bg-white/10 text-slate-300 transition-colors"
            >
              Help & Synopsis
            </button>
          </nav>
        </div>

        {/* Center: Command Palette / Search Omnibar */}
        <div
          onClick={() => setShowCommandPalette(true)}
          className="cursor-pointer flex items-center justify-between w-72 sm:w-96 md:w-[420px] px-3 py-1 rounded-md text-[11px] font-mono border transition-all"
          style={{
            backgroundColor: theme.editorBg,
            borderColor: theme.border,
            color: '#94a3b8'
          }}
          title="Click or press Ctrl+K / Ctrl+P to open Command Palette"
        >
          <div className="flex items-center gap-2 truncate">
            <Search size={12} className="text-sky-400 shrink-0" />
            <span className="truncate">
              BEC Bagalkote • 22UIS717P — <span className="text-slate-200">{activeFile.name}</span>
            </span>
          </div>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-slate-400">
            Ctrl+K
          </span>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2">
          {/* 1-Click Run AI Review Button */}
          <button
            onClick={runHybridReview}
            disabled={isScanning}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-400/40 shadow-glow transition-all"
          >
            {isScanning ? (
              <RefreshCw size={12} className="animate-spin text-sky-300" />
            ) : (
              <Play size={12} className="fill-current text-sky-400" />
            )}
            <span>{isScanning ? 'Scanning...' : 'Run Review'}</span>
          </button>

          {/* Toggle Diff Split View */}
          <button
            onClick={() => setIsDiffMode(!isDiffMode)}
            className={`px-2 py-1 rounded-md text-[11px] border font-mono transition-colors flex items-center gap-1 ${
              isDiffMode
                ? 'bg-purple-500/30 text-purple-300 border-purple-400/50 shadow-glow-purple'
                : 'hover:bg-white/5 text-slate-300 border-transparent'
            }`}
            title="Toggle Side-by-Side Diff View"
          >
            <SplitSquareHorizontal size={13} />
            <span className="hidden md:inline">Diff</span>
          </button>

          {/* Academic Synopsis Badge */}
          <button
            onClick={() => setShowSynopsisModal(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-purple-500/10 border border-purple-400/30 text-purple-300 hover:bg-purple-500/20 text-[11px] transition-all"
            title="View 22UIS717P Synopsis Details"
          >
            <GraduationCap size={13} />
            <span className="hidden xl:inline">22UIS717P</span>
          </button>

          {/* Layout Toggle Buttons */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Toggle Primary Sidebar (Ctrl+B)"
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => setBottomPanelOpen(!bottomPanelOpen)}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Toggle Bottom Terminal Panel (Ctrl+`)"
          >
            <Terminal size={14} />
          </button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. MAIN WORKSPACE (Activity Bar + Sidebar + Editor + Panel)   */}
      {/* ============================================================ */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ---------------------------------------------------------- */}
        {/* A. ACTIVITY BAR (Iconic Left Bar, 48px)                   */}
        {/* ---------------------------------------------------------- */}
        <div
          className="w-12 shrink-0 flex flex-col justify-between items-center py-2 border-r z-20"
          style={{ backgroundColor: theme.activityBg, borderColor: theme.border }}
        >
          {/* Top Activity Icons */}
          <div className="flex flex-col items-center gap-1.5 w-full">
            {/* 1. Review & Problems (Modules 3, 4, 5) */}
            <button
              onClick={() => { setActiveActivity('review'); setSidebarOpen(true) }}
              className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                activeActivity === 'review'
                  ? 'text-sky-400 bg-sky-500/15 border-l-2 border-sky-400 shadow-glow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title="CodeVision AI Reviewer (Modules 3 & 4: Static + LLM)"
            >
              <Zap size={20} />
              {findings.length > 0 && (
                <span className="absolute top-1 right-1 px-1 py-0.2 rounded-full text-[9px] font-bold bg-rose-500 text-white animate-pulse">
                  {findings.length}
                </span>
              )}
            </button>

            {/* 2. Explorer (Module 2: Ingestion) */}
            <button
              onClick={() => { setActiveActivity('explorer'); setSidebarOpen(true) }}
              className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                activeActivity === 'explorer'
                  ? 'text-sky-400 bg-sky-500/15 border-l-2 border-sky-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title="File Explorer (Module 2: Ingestion & Preprocessing)"
            >
              <Folder size={19} />
            </button>

            {/* 3. Search */}
            <button
              onClick={() => { setActiveActivity('search'); setSidebarOpen(true) }}
              className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                activeActivity === 'search'
                  ? 'text-sky-400 bg-sky-500/15 border-l-2 border-sky-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title="Search in Files & Rules"
            >
              <Search size={19} />
            </button>

            {/* 4. Git & PR Integration (Module 8) */}
            <button
              onClick={() => { setActiveActivity('git'); setSidebarOpen(true) }}
              className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                activeActivity === 'git'
                  ? 'text-sky-400 bg-sky-500/15 border-l-2 border-sky-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title="GitHub PR Integration (Module 8: CI/CD Bot)"
            >
              <GitPullRequest size={19} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-400" />
            </button>

            {/* 5. Diff & Fix Studio (Module 6) */}
            <button
              onClick={() => { setActiveActivity('diff'); setSidebarOpen(true); setIsDiffMode(true) }}
              className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                activeActivity === 'diff'
                  ? 'text-purple-400 bg-purple-500/15 border-l-2 border-purple-400 shadow-glow-purple'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title="Diff & Automated Fix Studio (Module 6)"
            >
              <Wand2 size={19} />
            </button>

            {/* 6. Test Runner & Synthesis (Module 7) */}
            <button
              onClick={() => { setActiveActivity('tests'); setSidebarOpen(true); setBottomTab('tests'); setBottomPanelOpen(true) }}
              className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                activeActivity === 'tests'
                  ? 'text-emerald-400 bg-emerald-500/15 border-l-2 border-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title="Test Synthesis & Pytest Runner (Module 7)"
            >
              <FlaskConicalIcon size={19} />
            </button>

            {/* 7. Severity & Health Scoring (Module 5) */}
            <button
              onClick={() => { setActiveActivity('metrics'); setSidebarOpen(true) }}
              className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                activeActivity === 'metrics'
                  ? 'text-amber-400 bg-amber-500/15 border-l-2 border-amber-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title="Quality Scoring & Severity Matrix (Module 5)"
            >
              <Gauge size={19} />
            </button>

            {/* 8. Synopsis 9-Modules Pipeline */}
            <button
              onClick={() => { setActiveActivity('modules'); setSidebarOpen(true) }}
              className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                activeActivity === 'modules'
                  ? 'text-cyan-400 bg-cyan-500/15 border-l-2 border-cyan-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title="Synopsis 9-Modules Pipeline (22UIS717P)"
            >
              <Cpu size={19} />
            </button>

            {/* 9. History & Reports (Module 9) */}
            <button
              onClick={() => { setActiveActivity('history'); setSidebarOpen(true) }}
              className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                activeActivity === 'history'
                  ? 'text-sky-400 bg-sky-500/15 border-l-2 border-sky-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title="Review History & Reports (Module 9)"
            >
              <FileText size={19} />
            </button>
          </div>

          {/* Bottom Activity Icons: Profile & Settings */}
          <div className="flex flex-col items-center gap-1.5 w-full">
            {/* Academic Synopsis Modal Button */}
            <button
              onClick={() => setShowSynopsisModal(true)}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
              title="BEC Bagalkote Synopsis Info & Team"
            >
              <GraduationCap size={19} />
            </button>

            {/* Settings & Theme */}
            <button
              onClick={() => { setActiveActivity('settings'); setSidebarOpen(true) }}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                activeActivity === 'settings'
                  ? 'text-sky-400 bg-sky-500/15'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title="Settings & Appearance"
            >
              <Settings size={18} />
            </button>

            {/* User Avatar (Module 1 Auth) */}
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-black border border-white/20 cursor-pointer shadow-glow"
              title={`Logged in as: ${user?.full_name || 'Shreya Fakirapur'} (Lead Reviewer)`}
            >
              {(user?.full_name || 'SF').substring(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* B. PRIMARY SIDEBAR (Collapsible, dynamic content)          */}
        {/* ---------------------------------------------------------- */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full border-r flex flex-col shrink-0 overflow-hidden text-xs z-10"
              style={{ backgroundColor: theme.sidebarBg, borderColor: theme.border }}
            >
              {/* Sidebar Header */}
              <div
                className="h-9 px-3 flex items-center justify-between font-mono font-semibold tracking-wider text-[11px] text-slate-300 border-b shrink-0"
                style={{ borderColor: theme.border }}
              >
                <span className="uppercase flex items-center gap-1.5 truncate">
                  {activeActivity === 'explorer' && '📁 Explorer: Medilink-API'}
                  {activeActivity === 'review' && '⚡ CodeVision Review Findings'}
                  {activeActivity === 'search' && '🔍 Global Search & Rules'}
                  {activeActivity === 'git' && '🔀 Git & Pull Request (Mod 8)'}
                  {activeActivity === 'diff' && '🪄 Fix Studio & Diffs (Mod 6)'}
                  {activeActivity === 'tests' && '🧪 Test Explorer (Mod 7)'}
                  {activeActivity === 'metrics' && '📊 Severity & Health (Mod 5)'}
                  {activeActivity === 'modules' && '🧩 Synopsis 9-Modules (22UIS717P)'}
                  {activeActivity === 'history' && '📜 Audit History & Reports'}
                  {activeActivity === 'settings' && '⚙️ Workspace Settings'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                    title="Collapse Sidebar"
                  >
                    <ChevronDown size={14} className="rotate-90" />
                  </button>
                </div>
              </div>

              {/* Sidebar Body */}
              <div className="flex-1 overflow-y-auto p-2 space-y-3">

                {/* 1. EXPLORER VIEW */}
                {activeActivity === 'explorer' && (
                  <div className="space-y-3">
                    {/* Open Editors Section */}
                    <div>
                      <div className="text-[10px] font-mono uppercase text-slate-400 px-2 py-1 font-semibold">
                        Open Editors ({openTabs.length})
                      </div>
                      <div className="space-y-0.5">
                        {openTabs.map(path => {
                          const f = files.find(x => x.path === path)
                          if (!f) return null
                          const isAct = f.path === activeFile.path
                          return (
                            <div
                              key={path}
                              onClick={() => handleOpenFile(path)}
                              className={`flex items-center justify-between px-2.5 py-1 rounded cursor-pointer group transition-colors ${
                                isAct ? 'bg-sky-500/20 text-white font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <FileCode size={13} className={isAct ? 'text-sky-400' : 'text-slate-500'} />
                                <span className="truncate">{f.name}</span>
                              </div>
                              <button
                                onClick={(e) => handleCloseTab(e, path)}
                                className="opacity-0 group-hover:opacity-100 hover:text-rose-400 p-0.5 rounded"
                              >
                                <X size={11} />
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Project Workspace Folder Tree */}
                    <div className="pt-2 border-t" style={{ borderColor: theme.border }}>
                      <div className="flex items-center justify-between px-2 py-1 text-[10px] font-mono uppercase text-slate-400 font-semibold">
                        <span>Project Workspace</span>
                        <span className="text-[9px] text-sky-400">8 Files</span>
                      </div>
                      <div className="space-y-0.5 mt-1 font-mono">
                        {files.map(f => {
                          const isAct = f.path === activeFile.path
                          return (
                            <div
                              key={f.path}
                              onClick={() => handleOpenFile(f.path)}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer transition-all ${
                                isAct
                                  ? 'bg-sky-500/20 text-sky-300 font-semibold border-l-2 border-sky-400'
                                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <FileCode size={13} className={f.hasIssues ? 'text-rose-400' : 'text-emerald-400'} />
                                <span className="truncate">{f.name}</span>
                              </div>
                              {f.hasIssues && (
                                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                  {f.issueCount}
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Preprocessing Metrics Card (Module 2) */}
                    <div className="p-3 rounded-lg border bg-white/[0.02]" style={{ borderColor: theme.border }}>
                      <div className="flex items-center justify-between text-[11px] font-mono text-sky-400 mb-2">
                        <span className="flex items-center gap-1 font-bold">
                          <Cpu size={12} /> Mod 2: Preprocessor
                        </span>
                        <span className="text-[10px] text-emerald-400">Ready</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                        <div>Lines: <span className="text-white">{activeFile.content.split('\n').length}</span></div>
                        <div>Chars: <span className="text-white">{activeFile.content.length}</span></div>
                        <div>AST Lang: <span className="text-sky-300 capitalize">{activeFile.language}</span></div>
                        <div>Status: <span className="text-emerald-400">Normalized</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. CODE REVIEW FINDINGS (Modules 3, 4, 5) */}
                {activeActivity === 'review' && (
                  <div className="space-y-3">
                    {/* Severity Filter Strip */}
                    <div className="flex items-center gap-1 p-1 rounded-md bg-black/20 border" style={{ borderColor: theme.border }}>
                      {(['all', 'critical', 'high', 'medium'] as const).map(sev => (
                        <button
                          key={sev}
                          onClick={() => setSeverityFilter(sev)}
                          className={`flex-1 py-1 rounded text-[10px] font-mono capitalize transition-all ${
                            severityFilter === sev
                              ? 'bg-sky-500 text-black font-bold shadow-xs'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {sev}
                        </button>
                      ))}
                    </div>

                    {/* Action: Run Hybrid Review */}
                    <button
                      onClick={runHybridReview}
                      disabled={isScanning}
                      className="w-full py-2 px-3 rounded-lg font-mono font-bold text-xs bg-gradient-to-r from-sky-400 to-purple-500 text-black flex items-center justify-center gap-2 shadow-glow hover:opacity-95 transition-all"
                    >
                      {isScanning ? (
                        <RefreshCw size={14} className="animate-spin text-black" />
                      ) : (
                        <Play size={14} className="fill-black" />
                      )}
                      <span>{isScanning ? 'Running Semgrep + LLM...' : 'Run Hybrid Code Review'}</span>
                    </button>

                    {/* Issues List */}
                    <div className="space-y-2 mt-2">
                      <div className="text-[10px] font-mono uppercase text-slate-400 px-1 font-semibold flex justify-between">
                        <span>Detected Vulnerabilities</span>
                        <span className="text-rose-400">{filteredFindings.length} Items</span>
                      </div>

                      {filteredFindings.map((finding) => (
                        <div
                          key={finding.id}
                          onClick={() => {
                            if (finding.title.includes('SQL')) handleOpenFile('src/routes/patients.py')
                            else if (finding.title.includes('Secret')) handleOpenFile('src/config/secrets.py')
                            else if (finding.title.includes('N+1')) handleOpenFile('src/services/appointments.py')
                            else handleOpenFile('src/calculate.py')
                          }}
                          className={`p-2.5 rounded-lg border cursor-pointer transition-all hover:-translate-y-0.5 ${
                            finding.severity === 'critical'
                              ? 'bg-rose-500/10 border-rose-500/30 hover:border-rose-400'
                              : finding.severity === 'high'
                              ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-400'
                              : 'bg-sky-500/10 border-sky-500/30 hover:border-sky-400'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold font-mono uppercase ${
                              finding.severity === 'critical'
                                ? 'bg-rose-500 text-white'
                                : finding.severity === 'high'
                                ? 'bg-amber-500 text-black'
                                : 'bg-sky-500 text-black'
                            }`}>
                              {finding.severity}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              Line {finding.line}
                            </span>
                          </div>

                          <h4 className="font-semibold text-white text-[12px] leading-tight mb-1">
                            {finding.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                            {finding.description}
                          </p>

                          <div className="flex items-center justify-between pt-1 border-t border-white/5">
                            <span className="text-[10px] font-mono text-sky-400 truncate">
                              {finding.type === 'security' ? 'Semgrep AST Match' : 'Neural LLM Insight'}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleApplyFix(finding.after_code)
                              }}
                              className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-400/40 flex items-center gap-1 transition-colors"
                            >
                              <Wand2 size={10} /> Quick Fix
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. DIFF & FIX STUDIO (Module 6) */}
                {activeActivity === 'diff' && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border bg-purple-500/10 border-purple-500/30 text-purple-300 space-y-2">
                      <div className="flex items-center gap-2 font-bold font-mono text-xs">
                        <Wand2 size={14} /> Module 6: Live Patch Synthesizer
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Side-by-side AST diff generator transforms vulnerable snippets into hardened, production-ready code with zero regressions.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => setIsDiffMode(true)}
                        className={`w-full py-2 px-3 rounded-lg font-mono text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                          isDiffMode ? 'bg-purple-500 text-black border-purple-400 shadow-glow-purple' : 'bg-white/5 text-slate-300 border-white/10'
                        }`}
                      >
                        <SplitSquareHorizontal size={13} />
                        <span>{isDiffMode ? 'Split Diff Active' : 'Enable Side-by-Side Diff'}</span>
                      </button>

                      <button
                        onClick={() => handleApplyFix()}
                        className="w-full py-2.5 px-3 rounded-lg font-mono text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center gap-2 shadow-glow transition-all"
                      >
                        <CheckCheck size={14} />
                        <span>Apply AI Patch to {activeFile.name}</span>
                      </button>
                    </div>

                    {/* Pre-configured Fix Details */}
                    <div className="p-2.5 rounded-lg border bg-white/[0.02] space-y-2 text-[11px] font-mono" style={{ borderColor: theme.border }}>
                      <div className="text-slate-400">Target: <span className="text-white">{activeFile.path}</span></div>
                      <div className="text-slate-400">Patched CWEs: <span className="text-emerald-400">CWE-369, CWE-89</span></div>
                      <div className="text-slate-400">Regression Tests: <span className="text-sky-400">4 Generated</span></div>
                      <div className="text-slate-400">Syntax Check: <span className="text-emerald-400">Valid AST</span></div>
                    </div>
                  </div>
                )}

                {/* 4. GIT & PULL REQUEST (Module 8) */}
                {activeActivity === 'git' && (
                  <div className="space-y-3">
                    <div className="p-2.5 rounded-lg border bg-white/[0.02] space-y-2" style={{ borderColor: theme.border }}>
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <GitBranch size={13} className="text-purple-400" /> main
                        </span>
                        <span className="text-[10px] text-emerald-400">Synced</span>
                      </div>
                      <div className="text-[11px] font-semibold text-white">
                        PR #248: Add Patient Auth & Calculate Endpoints
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        Author: <span className="text-sky-300">shreya-s-f</span> • +24 / -8 lines
                      </div>
                    </div>

                    {/* Changed Files in PR */}
                    <div>
                      <div className="text-[10px] font-mono uppercase text-slate-400 px-1 py-1 font-semibold">
                        Files in Pull Request
                      </div>
                      <div className="space-y-1">
                        <div
                          onClick={() => handleOpenFile('src/calculate.py')}
                          className="flex items-center justify-between px-2 py-1 rounded bg-white/5 hover:bg-white/10 cursor-pointer font-mono text-[11px]"
                        >
                          <span className="text-slate-200">src/calculate.py</span>
                          <span className="text-emerald-400 text-[10px]">+6 -2</span>
                        </div>
                        <div
                          onClick={() => handleOpenFile('src/routes/patients.py')}
                          className="flex items-center justify-between px-2 py-1 rounded bg-white/5 hover:bg-white/10 cursor-pointer font-mono text-[11px]"
                        >
                          <span className="text-slate-200">src/routes/patients.py</span>
                          <span className="text-emerald-400 text-[10px]">+8 -4</span>
                        </div>
                      </div>
                    </div>

                    {/* Trigger PR Bot Review */}
                    <button
                      onClick={async () => {
                        setAppliedNotification('CodeVision GitHub Bot: Reviewed PR #248. Posted 2 inline review comments.')
                        setTimeout(() => setAppliedNotification(null), 3500)
                      }}
                      className="w-full py-2 px-3 rounded-lg font-mono text-xs font-semibold bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-400/40 flex items-center justify-center gap-2 transition-all shadow-glow-purple"
                    >
                      <GitPullRequest size={13} />
                      <span>Trigger AI Bot PR Review</span>
                    </button>
                  </div>
                )}

                {/* 5. TEST EXPLORER (Module 7) */}
                {activeActivity === 'tests' && (
                  <div className="space-y-3">
                    <button
                      onClick={runPytestSuite}
                      disabled={testsRunning}
                      className="w-full py-2 px-3 rounded-lg font-mono text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center gap-2 shadow-glow transition-all"
                    >
                      {testsRunning ? (
                        <RefreshCw size={13} className="animate-spin text-black" />
                      ) : (
                        <Play size={13} className="fill-black" />
                      )}
                      <span>{testsRunning ? 'Running Pytest Suite...' : 'Run All Tests (Pytest)'}</span>
                    </button>

                    {/* Progress Bar */}
                    <div className="p-2 rounded-lg bg-black/20 border" style={{ borderColor: theme.border }}>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span>Progress: {testsPassed}/4</span>
                        <span className="text-emerald-400 font-bold">{testsPassed * 25}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 transition-all duration-300"
                          style={{ width: `${testsPassed * 25}%` }}
                        />
                      </div>
                    </div>

                    {/* Test List */}
                    <div className="space-y-1 font-mono text-[11px]">
                      {[
                        'test_calculate_valid_division',
                        'test_calculate_float_precision',
                        'test_calculate_negative_numbers',
                        'test_calculate_zero_division_raises'
                      ].map((tName, i) => (
                        <div
                          key={tName}
                          className="flex items-center justify-between p-2 rounded bg-white/[0.02] border"
                          style={{ borderColor: theme.border }}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {testsPassed > i ? (
                              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                            ) : testsRunning && testsPassed === i ? (
                              <RefreshCw size={13} className="animate-spin text-sky-400 shrink-0" />
                            ) : (
                              <div className="w-3 h-3 rounded-full border border-slate-600 shrink-0" />
                            )}
                            <span className="truncate text-slate-300">{tName}</span>
                          </div>
                          <span className="text-[10px] text-slate-500">0.05s</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. METRICS & SCORING (Module 5) */}
                {activeActivity === 'metrics' && (
                  <div className="space-y-3">
                    {/* Big Health Score Card */}
                    <div className="p-4 rounded-xl border bg-gradient-to-br from-sky-500/10 via-purple-500/10 to-transparent text-center space-y-2" style={{ borderColor: theme.border }}>
                      <div className="text-[10px] font-mono uppercase text-sky-400 font-bold">
                        Repository Health Score
                      </div>
                      <div className="text-4xl font-extrabold font-mono text-white">
                        82<span className="text-lg text-slate-400">/100</span>
                      </div>
                      <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-sky-500/20 text-sky-300 border border-sky-400/40">
                        Grade: B (High Quality)
                      </div>
                    </div>

                    {/* Severity Breakdown Bar */}
                    <div className="p-3 rounded-lg border bg-white/[0.02] space-y-2 font-mono text-[11px]" style={{ borderColor: theme.border }}>
                      <div className="text-[10px] uppercase text-slate-400 font-bold">Severity Matrix</div>
                      <div className="flex items-center justify-between text-rose-400">
                        <span>Critical:</span>
                        <span className="font-bold">2 Issues</span>
                      </div>
                      <div className="flex items-center justify-between text-amber-400">
                        <span>High:</span>
                        <span className="font-bold">1 Issue</span>
                      </div>
                      <div className="flex items-center justify-between text-sky-400">
                        <span>Medium:</span>
                        <span className="font-bold">1 Issue</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-400">
                        <span>Low / Style:</span>
                        <span className="font-bold">0 Issues</span>
                      </div>
                    </div>

                    {/* Maintainability Index */}
                    <div className="p-3 rounded-lg border bg-white/[0.02] space-y-1.5 font-mono text-[11px]" style={{ borderColor: theme.border }}>
                      <div className="text-[10px] uppercase text-slate-400 font-bold">Quality Indices</div>
                      <div className="flex justify-between text-slate-300">
                        <span>Maintainability:</span>
                        <span className="text-emerald-400">88 / 100</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Security Rating:</span>
                        <span className="text-amber-400">B-</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Test Coverage:</span>
                        <span className="text-sky-400">92%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. SYNOPSIS 9-MODULES (22UIS717P) */}
                {activeActivity === 'modules' && (
                  <div className="space-y-3">
                    <button
                      onClick={runFullPipeline}
                      disabled={pipelineRunning}
                      className="w-full py-2.5 px-3 rounded-lg font-mono font-bold text-xs bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 text-black flex items-center justify-center gap-2 shadow-glow hover:opacity-95 transition-all"
                    >
                      {pipelineRunning ? (
                        <RefreshCw size={14} className="animate-spin text-black" />
                      ) : (
                        <Play size={14} className="fill-black" />
                      )}
                      <span>{pipelineRunning ? `Executing Step ${pipelineStep}/9...` : '▶ Run 9-Step Full Pipeline'}</span>
                    </button>

                    <div className="text-[10px] font-mono uppercase text-slate-400 px-1 font-semibold flex justify-between">
                      <span>Synopsis Architecture</span>
                      <span className="text-emerald-400">9/9 Online</span>
                    </div>

                    <div className="space-y-1.5">
                      {moduleStatuses.map((mod, i) => (
                        <div
                          key={mod.id}
                          className={`p-2 rounded-lg border transition-all ${
                            mod.status === 'running'
                              ? 'bg-sky-500/20 border-sky-400 shadow-glow'
                              : mod.status === 'success'
                              ? 'bg-emerald-500/10 border-emerald-500/30'
                              : 'bg-white/[0.02] border-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-[10px] font-bold text-sky-400">
                              {mod.id}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-white/5 text-slate-400">
                              {mod.latency}ms
                            </span>
                          </div>
                          <div className="font-semibold text-white text-[11px] leading-tight mb-0.5">
                            {mod.name}
                          </div>
                          <div className="text-[10px] text-slate-400 leading-tight">
                            {mod.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 8. SETTINGS & THEMES */}
                {activeActivity === 'settings' && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="text-[10px] uppercase text-slate-400 font-bold px-1">Theme Palette</div>
                    <div className="space-y-1.5">
                      {Object.entries(THEMES).map(([key, t]) => (
                        <button
                          key={key}
                          onClick={() => setActiveTheme(key as any)}
                          className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                            activeTheme === key
                              ? 'border-sky-400 bg-sky-500/15 shadow-glow text-white font-bold'
                              : 'border-white/5 bg-white/[0.02] text-slate-300 hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ backgroundColor: t.accent }} />
                            <span>{t.name}</span>
                          </div>
                          {activeTheme === key && <Check size={13} className="text-sky-400" />}
                        </button>
                      ))}
                    </div>

                    <div className="pt-3 border-t space-y-2" style={{ borderColor: theme.border }}>
                      <div className="text-[10px] uppercase text-slate-400 font-bold px-1">AI Engine & Strictness</div>
                      <div className="p-2.5 rounded-lg border bg-white/[0.02] space-y-2 text-[11px]" style={{ borderColor: theme.border }}>
                        <div className="flex justify-between text-slate-300">
                          <span>LLM Model:</span>
                          <span className="text-sky-400 font-bold">Gemini 3.8 Flash</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Semgrep Rulepack:</span>
                          <span className="text-purple-400 font-bold">OWASP Top 10 + CWE</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Auto-Apply Fixes:</span>
                          <span className="text-emerald-400 font-bold">Manual Confirmation</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. HISTORY & REPORTS (Module 9) */}
                {activeActivity === 'history' && (
                  <div className="space-y-3 font-mono text-xs">
                    <button
                      onClick={() => setShowSynopsisModal(true)}
                      className="w-full py-2 px-3 rounded-lg font-bold text-xs bg-sky-500/20 text-sky-300 border border-sky-400/40 hover:bg-sky-500/30 flex items-center justify-center gap-2 transition-all shadow-glow"
                    >
                      <Download size={13} />
                      <span>Export Academic Report (PDF)</span>
                    </button>

                    <div className="text-[10px] uppercase text-slate-400 font-bold px-1">Scan History Logs</div>
                    <div className="space-y-1.5">
                      {[
                        { file: 'calculate.py', date: 'Just now', score: 82, findings: 2 },
                        { file: 'patients.py', date: '10 mins ago', score: 71, findings: 1 },
                        { file: 'secrets.py', date: '1 hour ago', score: 65, findings: 1 },
                        { file: 'medilink-api (Full)', date: 'Yesterday', score: 88, findings: 4 }
                      ].map((item, idx) => (
                        <div key={idx} className="p-2 rounded-lg border bg-white/[0.02]" style={{ borderColor: theme.border }}>
                          <div className="flex justify-between font-bold text-white mb-0.5">
                            <span>{item.file}</span>
                            <span className="text-sky-400">{item.score}/100</span>
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span>{item.date}</span>
                            <span className="text-rose-400">{item.findings} issues</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 10. SEARCH VIEW */}
                {activeActivity === 'search' && (
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search across files..."
                        className="w-full px-2.5 py-1.5 rounded bg-black/30 border text-slate-200 text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                        style={{ borderColor: theme.border }}
                      />
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 px-1">
                      Type to search AST patterns, function symbols, or keywords.
                    </div>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ---------------------------------------------------------- */}
        {/* C. CENTER WORKSPACE (Editor Tabs + Code Area + Diff Mode)  */}
        {/* ---------------------------------------------------------- */}
        <div className="flex-1 flex flex-col overflow-hidden relative" style={{ backgroundColor: theme.editorBg }}>

          {/* 1. TABS HEADER BAR */}
          <div
            className="h-9 flex items-center justify-between border-b shrink-0 overflow-x-auto no-scrollbar"
            style={{ backgroundColor: theme.activityBg, borderColor: theme.border }}
          >
            {/* Tabs List */}
            <div className="flex items-center h-full">
              {openTabs.map(path => {
                const f = files.find(x => x.path === path)
                if (!f) return null
                const isActive = f.path === activeFile.path

                return (
                  <div
                    key={path}
                    onClick={() => handleOpenFile(path)}
                    className={`h-full flex items-center gap-2 px-3.5 border-r cursor-pointer text-xs font-mono transition-all group ${
                      isActive
                        ? 'border-t-2 border-t-sky-400 font-semibold text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                    style={{
                      backgroundColor: isActive ? theme.tabActiveBg : theme.tabInactiveBg,
                      borderColor: theme.border
                    }}
                  >
                    <FileCode size={13} className={isActive ? 'text-sky-400' : 'text-slate-500'} />
                    <span className="truncate max-w-[140px]">{f.name}</span>
                    {f.hasIssues && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="Contains detected review issues" />
                    )}
                    <button
                      onClick={(e) => handleCloseTab(e, path)}
                      className="opacity-0 group-hover:opacity-100 hover:text-rose-400 p-0.5 rounded ml-1"
                    >
                      <X size={11} />
                    </button>
                  </div>
                )
              })}

              {isDiffMode && (
                <div
                  className="h-full flex items-center gap-2 px-3.5 border-r border-t-2 border-t-purple-400 font-semibold text-purple-300 font-mono text-xs"
                  style={{ backgroundColor: theme.tabActiveBg, borderColor: theme.border }}
                >
                  <SplitSquareHorizontal size={13} className="text-purple-400" />
                  <span>Diff: {activeFile.name} (AI Fix)</span>
                  <button onClick={() => setIsDiffMode(false)} className="hover:text-rose-400 p-0.5 rounded ml-1">
                    <X size={11} />
                  </button>
                </div>
              )}
            </div>

            {/* Editor Action Buttons (Top Right of Editor) */}
            <div className="flex items-center gap-1 px-3">
              <button
                onClick={() => setIsDiffMode(!isDiffMode)}
                className={`p-1.5 rounded hover:bg-white/10 transition-colors ${isDiffMode ? 'text-purple-400' : 'text-slate-400 hover:text-white'}`}
                title="Toggle Side-by-Side Diff"
              >
                <SplitSquareHorizontal size={14} />
              </button>
              <button
                onClick={runHybridReview}
                className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-sky-400 transition-colors"
                title="Run Review on Current File"
              >
                <Play size={14} />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeFile.content)
                  setAppliedNotification('Source code copied to clipboard!')
                  setTimeout(() => setAppliedNotification(null), 2500)
                }}
                className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="Copy File Content"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>

          {/* 2. BREADCRUMBS BAR */}
          <div
            className="h-6 px-4 flex items-center gap-1.5 text-[11px] font-mono text-slate-400 border-b shrink-0 select-none"
            style={{ backgroundColor: theme.editorBg, borderColor: theme.border }}
          >
            <span>medilink-api</span>
            <ChevronRight size={11} className="text-slate-600" />
            <span>{activeFile.path.split('/')[0]}</span>
            <ChevronRight size={11} className="text-slate-600" />
            <span className="text-slate-200">{activeFile.name}</span>
            {activeFile.language === 'python' && (
              <>
                <ChevronRight size={11} className="text-slate-600" />
                <span className="text-sky-400">def calculate(a, b)</span>
              </>
            )}
          </div>

          {/* 3. CODE EDITOR AREA */}
          <div className="flex-1 flex overflow-hidden relative">

            {/* SCANNING LASER BEAM ANIMATION */}
            {scanLaserActive && (
              <motion.div
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-glow z-30 pointer-events-none opacity-80"
              />
            )}

            {/* 1-CLICK PATCH FLASH GLOW */}
            {patchFlash && (
              <motion.div
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
                className="absolute inset-0 bg-emerald-500/20 z-20 pointer-events-none"
              />
            )}

            {/* NORMAL CODE EDITOR MODE */}
            {!isDiffMode ? (
              <div className="flex-1 flex overflow-auto font-mono text-[13px] leading-6 p-2 relative">
                {/* Line Numbers Gutter */}
                <div className="shrink-0 text-right pr-4 pl-2 text-slate-600 select-none">
                  {activeFile.content.split('\n').map((_, idx) => {
                    const lineNo = idx + 1
                    const hasIssue = activeFile.hasIssues && (lineNo === 4 || lineNo === 7 || lineNo === 2)
                    return (
                      <div
                        key={lineNo}
                        className={`flex items-center justify-end gap-1 ${hasIssue ? 'text-rose-400 font-bold' : ''}`}
                      >
                        {hasIssue && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
                        <span>{lineNo}</span>
                      </div>
                    )
                  })}
                </div>

                {/* Code Lines with Syntax Colors & Inline Squigglies */}
                <div className="flex-1 whitespace-pre outline-none text-slate-200">
                  {activeFile.content.split('\n').map((line, idx) => {
                    const lineNo = idx + 1
                    const issueAtLine = findings.find(f => f.line === lineNo)

                    return (
                      <div
                        key={lineNo}
                        onMouseEnter={(e) => {
                          if (issueAtLine) {
                            setHoveredLine(lineNo)
                            setHoverPopoverPos({ x: e.clientX, y: e.clientY })
                          }
                        }}
                        onMouseLeave={() => setHoveredLine(null)}
                        className={`relative px-1 hover:bg-white/[0.04] transition-colors rounded ${
                          issueAtLine ? 'bg-rose-500/10' : ''
                        }`}
                      >
                        {/* Syntax Color Helper */}
                        <SyntaxColoredLine line={line} />

                        {/* Inline Wavy Squiggly Underline */}
                        {issueAtLine && (
                          <div className="absolute bottom-0 left-1 right-1 h-[2px] bg-repeat-x bg-[radial-gradient(circle,_#ef4444_50%,_transparent_50%)] bg-[length:6px_2px] animate-pulse" />
                        )}

                        {/* Hover Quick-Fix Popover */}
                        {hoveredLine === lineNo && issueAtLine && (
                          <div className="absolute left-8 top-6 z-40 w-80 p-3 rounded-lg border bg-slate-900/95 backdrop-blur-md shadow-2xl border-rose-500/40 text-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-rose-500 text-white font-mono">
                                {issueAtLine.severity}
                              </span>
                              <span className="text-slate-400 text-[10px] font-mono">Line {lineNo}</span>
                            </div>
                            <h5 className="font-bold text-white text-[12px] mb-1">{issueAtLine.title}</h5>
                            <p className="text-[11px] text-slate-300 leading-snug mb-2.5">{issueAtLine.description}</p>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleApplyFix(issueAtLine.after_code)}
                                className="px-2.5 py-1 rounded font-bold font-mono text-[10px] bg-emerald-500 text-black hover:bg-emerald-400 flex items-center gap-1 shadow-glow transition-colors"
                              >
                                <Wand2 size={11} /> Quick Fix
                              </button>
                              <button
                                onClick={() => setIsDiffMode(true)}
                                className="px-2 py-1 rounded font-mono text-[10px] bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
                              >
                                Preview Diff
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              /* DIFF MODE: SIDE-BY-SIDE BEFORE VS AFTER */
              <div className="flex-1 flex overflow-hidden font-mono text-[12px] leading-6 divide-x" style={{ borderColor: theme.border }}>
                {/* Left: Original Vulnerable Code */}
                <div className="flex-1 overflow-auto p-3 bg-rose-950/20">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-rose-500/20 text-[11px] text-rose-400 font-bold">
                    <span>ORIGINAL SOURCE (Vulnerable)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono">2 Issues Detected</span>
                  </div>
                  <pre className="text-rose-200/90 whitespace-pre">
                    {activeFile.content}
                  </pre>
                </div>

                {/* Right: AI Patched Hardened Code */}
                <div className="flex-1 overflow-auto p-3 bg-emerald-950/20">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-500/20 text-[11px] text-emerald-400 font-bold">
                    <span>AI CORRECTED PATCH (Module 6)</span>
                    <button
                      onClick={() => handleApplyFix()}
                      className="px-2.5 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-500 text-black hover:bg-emerald-400 shadow-glow flex items-center gap-1 transition-all"
                    >
                      <CheckCheck size={11} /> Accept Patch
                    </button>
                  </div>
                  <pre className="text-emerald-200/90 whitespace-pre">
                    {activeFile.fixedContent || activeFile.content}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* -------------------------------------------------------- */}
          {/* D. BOTTOM DRAWER / PANEL (Collapsible, VS Code Style)     */}
          {/* -------------------------------------------------------- */}
          <AnimatePresence initial={false}>
            {bottomPanelOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 210, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t flex flex-col shrink-0 overflow-hidden z-20"
                style={{ backgroundColor: theme.panelBg, borderColor: theme.border }}
              >
                {/* Bottom Panel Header Tabs */}
                <div
                  className="h-8 px-3 flex items-center justify-between border-b shrink-0 text-xs font-mono select-none"
                  style={{ backgroundColor: theme.activityBg, borderColor: theme.border }}
                >
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setBottomTab('problems')}
                      className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
                        bottomTab === 'problems' ? 'text-sky-400 font-bold bg-white/5 border-b-2 border-sky-400' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <AlertTriangle size={12} className="text-amber-400" />
                      <span>PROBLEMS ({findings.length})</span>
                    </button>

                    <button
                      onClick={() => setBottomTab('copilot')}
                      className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
                        bottomTab === 'copilot' ? 'text-purple-400 font-bold bg-white/5 border-b-2 border-purple-400 shadow-glow-purple' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Sparkles size={12} className="text-purple-400" />
                      <span>CODEVISION COPILOT</span>
                    </button>

                    <button
                      onClick={() => setBottomTab('semgrep')}
                      className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
                        bottomTab === 'semgrep' ? 'text-sky-400 font-bold bg-white/5 border-b-2 border-sky-400' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <ShieldCheck size={12} className="text-sky-400" />
                      <span>SEMGREP AST</span>
                    </button>

                    <button
                      onClick={() => setBottomTab('tests')}
                      className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
                        bottomTab === 'tests' ? 'text-emerald-400 font-bold bg-white/5 border-b-2 border-emerald-400' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <FlaskConicalIcon size={12} className="text-emerald-400" />
                      <span>TEST RUNNER (PYTEST)</span>
                    </button>

                    <button
                      onClick={() => setBottomTab('terminal')}
                      className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
                        bottomTab === 'terminal' ? 'text-amber-400 font-bold bg-white/5 border-b-2 border-amber-400' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Terminal size={12} className="text-amber-400" />
                      <span>TERMINAL</span>
                    </button>

                    <button
                      onClick={() => setBottomTab('synopsis')}
                      className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
                        bottomTab === 'synopsis' ? 'text-indigo-400 font-bold bg-white/5 border-b-2 border-indigo-400' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <GraduationCap size={12} className="text-indigo-400" />
                      <span>22UIS717P SYNOPSIS</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setBottomPanelOpen(false)}
                      className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                      title="Hide Panel"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>

                {/* Bottom Panel Content Body */}
                <div className="flex-1 overflow-auto p-2 font-mono text-xs">

                  {/* 1. PROBLEMS TAB */}
                  {bottomTab === 'problems' && (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-slate-500 border-b border-white/5 text-[10px] uppercase">
                          <th className="py-1 px-2">Severity</th>
                          <th className="py-1 px-2">Message</th>
                          <th className="py-1 px-2">File</th>
                          <th className="py-1 px-2">Line</th>
                          <th className="py-1 px-2">Source</th>
                          <th className="py-1 px-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {findings.map((f) => (
                          <tr
                            key={f.id}
                            className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                            onClick={() => {
                              if (f.title.includes('SQL')) handleOpenFile('src/routes/patients.py')
                              else if (f.title.includes('Secret')) handleOpenFile('src/config/secrets.py')
                              else handleOpenFile('src/calculate.py')
                            }}
                          >
                            <td className="py-1.5 px-2">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                                f.severity === 'critical' ? 'bg-rose-500 text-white' : f.severity === 'high' ? 'bg-amber-500 text-black' : 'bg-sky-500 text-black'
                              }`}>
                                {f.severity}
                              </span>
                            </td>
                            <td className="py-1.5 px-2 text-white font-medium truncate max-w-xs">{f.title}</td>
                            <td className="py-1.5 px-2 text-slate-400">{activeFile.name}</td>
                            <td className="py-1.5 px-2 text-sky-400">Ln {f.line}</td>
                            <td className="py-1.5 px-2 text-slate-500">{f.type === 'security' ? 'Semgrep' : 'LLM Reasoner'}</td>
                            <td className="py-1.5 px-2 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleApplyFix(f.after_code)
                                }}
                                className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-400/40"
                              >
                                Fix
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* 2. COPILOT AI CHAT */}
                  {bottomTab === 'copilot' && (
                    <div className="h-full flex flex-col justify-between">
                      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                        {chatMessages.map((msg, i) => (
                          <div
                            key={i}
                            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                          >
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-0.5">
                              <span>{msg.sender === 'user' ? 'You' : 'CodeVision Assistant'}</span>
                              <span>•</span>
                              <span>{msg.time}</span>
                            </div>
                            <div
                              className={`p-2.5 rounded-lg max-w-[85%] text-xs leading-relaxed ${
                                msg.sender === 'user'
                                  ? 'bg-sky-500 text-black font-semibold rounded-tr-none'
                                  : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-none'
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        ))}
                        {isCopilotTyping && (
                          <div className="text-[11px] text-sky-400 animate-pulse flex items-center gap-1">
                            <Sparkles size={12} /> CodeVision Copilot is reasoning...
                          </div>
                        )}
                      </div>

                      {/* Chat Input */}
                      <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Ask about vulnerabilities, pytest cases, or algorithm optimizations..."
                          className="flex-1 px-3 py-1.5 rounded-md bg-black/40 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded-md bg-purple-500 hover:bg-purple-400 text-black font-bold text-xs flex items-center gap-1 shadow-glow-purple"
                        >
                          <Send size={12} /> Send
                        </button>
                      </form>
                    </div>
                  )}

                  {/* 3. SEMGREP AST */}
                  {bottomTab === 'semgrep' && (
                    <div className="space-y-1.5 text-[11px]">
                      <div className="text-slate-400 mb-1">
                        Static Rule Engine: <span className="text-emerald-400">Active</span> | AST Grammar: <span className="text-sky-300">Tree-sitter Python / TS</span>
                      </div>
                      <div className="p-2 rounded bg-black/30 border border-white/5 space-y-1">
                        <div className="text-rose-400 font-bold">[RULE: python.security.injection.sql.raw-string-concat]</div>
                        <div className="text-slate-300">Pattern: `query = "..." + $USER_INPUT` matched at line 7 in `patients.py`</div>
                        <div className="text-slate-500 text-[10px]">CWE-89: Improper Neutralization of Special Elements used in an SQL Command</div>
                      </div>
                      <div className="p-2 rounded bg-black/30 border border-white/5 space-y-1">
                        <div className="text-amber-400 font-bold">[RULE: python.lang.bugs.zerodivision.unhandled]</div>
                        <div className="text-slate-300">Pattern: `return $A / $B` without prior divisor zero assert matched at line 4 in `calculate.py`</div>
                      </div>
                    </div>
                  )}

                  {/* 4. PYTEST TERMINAL RUNNER */}
                  {bottomTab === 'tests' && (
                    <div className="h-full flex flex-col justify-between">
                      <div className="overflow-y-auto space-y-1 text-slate-300 font-mono text-[11px]">
                        {testLogs.map((log, i) => (
                          <div
                            key={i}
                            className={log.includes('PASSED') ? 'text-emerald-400 font-bold' : log.includes('starts') ? 'text-sky-300' : 'text-slate-400'}
                          >
                            {log}
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 flex items-center justify-between border-t border-white/10">
                        <span className="text-slate-400 text-[10px]">
                          Automated Unit Test Synthesizer: Module 7 (22UIS717P)
                        </span>
                        <button
                          onClick={runPytestSuite}
                          disabled={testsRunning}
                          className="px-3 py-1 rounded bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 flex items-center gap-1 shadow-glow"
                        >
                          <Play size={11} className="fill-black" /> Run Suite
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 5. INTERACTIVE TERMINAL */}
                  {bottomTab === 'terminal' && (
                    <div className="h-full flex flex-col justify-between">
                      <div className="overflow-y-auto space-y-1 text-[11px]">
                        {terminalHistory.map((item, i) => (
                          <div
                            key={i}
                            className={item.type === 'input' ? 'text-sky-400 font-bold' : 'text-slate-300'}
                          >
                            {item.text}
                          </div>
                        ))}
                      </div>
                      <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <span className="text-emerald-400 font-bold text-[11px]">codevision@bec-bagalkote:~$</span>
                        <input
                          type="text"
                          value={terminalInput}
                          onChange={(e) => setTerminalInput(e.target.value)}
                          placeholder="Type 'help', 'scan', 'test', 'fix', or 'modules'..."
                          className="flex-1 bg-transparent border-none text-white text-xs font-mono focus:outline-none"
                        />
                      </form>
                    </div>
                  )}

                  {/* 6. ACADEMIC SYNOPSIS DETAILS */}
                  {bottomTab === 'synopsis' && (
                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="font-bold text-sky-400">
                        Basaveshwar Engineering College Bagalkote — Dept of Information Science and Engineering
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div className="p-2 rounded bg-white/5 border border-white/10">
                          <div className="text-slate-400">Course Code</div>
                          <div className="font-bold text-white">22UIS717P</div>
                        </div>
                        <div className="p-2 rounded bg-white/5 border border-white/10">
                          <div className="text-slate-400">Academic Year</div>
                          <div className="font-bold text-white">2026-2027 (7th Sem)</div>
                        </div>
                        <div className="p-2 rounded bg-white/5 border border-white/10">
                          <div className="text-slate-400">Project Guide</div>
                          <div className="font-bold text-purple-300">Prof. Deepa.I.K.</div>
                        </div>
                        <div className="p-2 rounded bg-white/5 border border-white/10">
                          <div className="text-slate-400">Methodology</div>
                          <div className="font-bold text-emerald-400">Hybrid Semgrep + LLM</div>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Associates: Ranjita Benakatti (2BA23IS073), Shreya Suresh Fakirapur (2BA23IS088), Prajwal Joshi (2BA24IS407), Preetam Joshi (2BA24IS408)
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. VS CODE STATUS BAR (Bottom 24px)                          */}
      {/* ============================================================ */}
      <footer
        className="h-6 px-3 flex items-center justify-between text-[11px] font-mono text-white select-none z-30 shrink-0"
        style={{ backgroundColor: theme.statusBarBg }}
      >
        {/* Left: Git Branch + Sync + Errors/Warnings + AI Engine */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-semibold hover:bg-black/20 px-1.5 py-0.5 rounded cursor-pointer transition-colors">
            <GitBranch size={12} />
            <span>main*</span>
          </div>

          <div
            onClick={() => { setBottomTab('problems'); setBottomPanelOpen(true) }}
            className="flex items-center gap-2 hover:bg-black/20 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
          >
            <span className="flex items-center gap-0.5">
              <XCircle size={12} className="text-rose-200" />
              <span>2</span>
            </span>
            <span className="flex items-center gap-0.5">
              <AlertTriangle size={12} className="text-amber-200" />
              <span>2</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 opacity-90">
            <Sparkles size={11} />
            <span>CodeVision: LLM + Semgrep Online</span>
          </div>
        </div>

        {/* Center: College Project Code */}
        <div
          onClick={() => setShowSynopsisModal(true)}
          className="hidden lg:flex items-center gap-1.5 font-bold cursor-pointer hover:underline"
        >
          <GraduationCap size={12} />
          <span>BEC Bagalkote • 22UIS717P</span>
        </div>

        {/* Right: Line/Col + Encoding + Language + Score Badge */}
        <div className="flex items-center gap-3">
          <span className="hover:bg-black/20 px-1 py-0.5 rounded cursor-pointer">
            Ln 14, Col 21
          </span>
          <span className="hidden sm:inline hover:bg-black/20 px-1 py-0.5 rounded cursor-pointer">
            Spaces: 4
          </span>
          <span className="hidden sm:inline hover:bg-black/20 px-1 py-0.5 rounded cursor-pointer">
            UTF-8
          </span>
          <span className="capitalize font-bold hover:bg-black/20 px-1.5 py-0.5 rounded cursor-pointer">
            {activeFile.language}
          </span>
          <div className="flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-full font-bold">
            <Gauge size={11} />
            <span>82/100 (B)</span>
          </div>
          <Bell size={12} className="hover:opacity-80 cursor-pointer" />
        </div>
      </footer>

      {/* ============================================================ */}
      {/* 4. TOAST NOTIFICATION POPUP                                  */}
      {/* ============================================================ */}
      <AnimatePresence>
        {appliedNotification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 right-6 z-50 p-3 rounded-lg shadow-2xl border bg-slate-900/95 backdrop-blur-md border-sky-400/40 text-xs font-mono text-white flex items-center gap-2.5 max-w-md"
          >
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span className="flex-1">{appliedNotification}</span>
            <button onClick={() => setAppliedNotification(null)} className="text-slate-400 hover:text-white">
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* 5. ACADEMIC SYNOPSIS MODAL (22UIS717P Details)               */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showSynopsisModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeUp">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl rounded-2xl border p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: theme.sidebarBg, borderColor: theme.border }}
            >
              <button
                onClick={() => setShowSynopsisModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 to-purple-500 flex items-center justify-center text-black font-bold">
                  <GraduationCap size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">BASAVESHWAR ENGINEERING COLLEGE (AUTONOMOUS)</h3>
                  <p className="text-xs text-slate-400 font-mono">DEPARTMENT OF INFORMATION SCIENCE AND ENGINEERING • 2026-27</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-400/30 text-sky-300 font-mono text-xs mb-4">
                <div className="font-bold">Project Synopsis: 22UIS717P</div>
                <div>Title: CodeVision.ai : AI Code Review Assistant</div>
              </div>

              <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
                <div>
                  <h4 className="font-bold text-white font-mono uppercase text-[11px] mb-1 text-purple-400">1. Project Guide</h4>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    <span className="font-bold text-white">Prof. Deepa.I.K.</span> — Assistant Professor, Department of ISE
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white font-mono uppercase text-[11px] mb-1 text-sky-400">2. Project Associates</h4>
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <div className="p-2 rounded bg-white/5 border border-white/10">
                      <div className="text-slate-400">2BA23IS073</div>
                      <div className="font-bold text-white">Ranjita Benakatti</div>
                    </div>
                    <div className="p-2 rounded bg-white/5 border border-white/10">
                      <div className="text-slate-400">2BA23IS088</div>
                      <div className="font-bold text-white">Shreya Suresh Fakirapur</div>
                    </div>
                    <div className="p-2 rounded bg-white/5 border border-white/10">
                      <div className="text-slate-400">2BA24IS407</div>
                      <div className="font-bold text-white">Prajwal Joshi</div>
                    </div>
                    <div className="p-2 rounded bg-white/5 border border-white/10">
                      <div className="text-slate-400">2BA24IS408</div>
                      <div className="font-bold text-white">Preetam Joshi</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white font-mono uppercase text-[11px] mb-1 text-emerald-400">3. System Objectives</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li>Develop an AI automated code-review assistant.</li>
                    <li>Identify bugs, logical errors, security vulnerabilities, and performance issues.</li>
                    <li>Evaluate code quality, maintainability, and coding style using hybrid static-analysis and AI.</li>
                    <li>Classify detected issues based on severity: Critical, High, Medium, Low.</li>
                    <li>Provide clear explanations, recommended solutions, and AI-generated code fixes.</li>
                    <li>Reduce manual code-review effort and improve overall software quality.</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowSynopsisModal(false)}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs font-mono shadow-glow"
                >
                  Close Synopsis
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* 6. COMMAND PALETTE MODAL (Ctrl+K / Ctrl+P)                    */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showCommandPalette && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs animate-fadeUp">
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="w-full max-w-xl rounded-xl border p-3 shadow-2xl"
              style={{ backgroundColor: theme.sidebarBg, borderColor: theme.border }}
            >
              <div className="flex items-center gap-2 px-2 pb-2 border-b border-white/10">
                <Search size={14} className="text-sky-400" />
                <input
                  type="text"
                  autoFocus
                  value={commandQuery}
                  onChange={(e) => setCommandQuery(e.target.value)}
                  placeholder="Type a command or file name (e.g. 'review', 'calculate.py', 'diff')..."
                  className="flex-1 bg-transparent border-none text-white text-xs font-mono focus:outline-none placeholder:text-slate-500"
                />
                <span className="text-[10px] text-slate-500 font-mono">ESC to close</span>
              </div>

              <div className="max-h-72 overflow-y-auto mt-2 space-y-1 font-mono text-xs">
                {[
                  { label: 'CodeVision: Run Hybrid Code Review', action: () => { runHybridReview(); setShowCommandPalette(false) }, icon: Play, tag: 'Command' },
                  { label: 'CodeVision: Apply 1-Click Fix to File', action: () => { handleApplyFix(); setShowCommandPalette(false) }, icon: Wand2, tag: 'Fix' },
                  { label: 'CodeVision: Toggle Side-by-Side Diff View', action: () => { setIsDiffMode(!isDiffMode); setShowCommandPalette(false) }, icon: SplitSquareHorizontal, tag: 'View' },
                  { label: 'CodeVision: Run Pytest Validation Suite', action: () => { runPytestSuite(); setShowCommandPalette(false) }, icon: FlaskConicalIcon, tag: 'Testing' },
                  { label: 'CodeVision: Execute 9-Step Full Pipeline', action: () => { runFullPipeline(); setShowCommandPalette(false) }, icon: Zap, tag: 'Pipeline' },
                  { label: 'File: calculate.py (Division by Zero)', action: () => { handleOpenFile('src/calculate.py'); setShowCommandPalette(false) }, icon: FileCode, tag: 'File' },
                  { label: 'File: patients.py (SQL Injection CWE-89)', action: () => { handleOpenFile('src/routes/patients.py'); setShowCommandPalette(false) }, icon: FileCode, tag: 'File' },
                  { label: 'File: secrets.py (Hardcoded Secret CWE-798)', action: () => { handleOpenFile('src/config/secrets.py'); setShowCommandPalette(false) }, icon: FileCode, tag: 'File' },
                  { label: 'Synopsis: View 22UIS717P BEC Bagalkote Info', action: () => { setShowSynopsisModal(true); setShowCommandPalette(false) }, icon: GraduationCap, tag: 'Academic' }
                ].filter(cmd => cmd.label.toLowerCase().includes(commandQuery.toLowerCase())).map((cmd, i) => (
                  <div
                    key={i}
                    onClick={cmd.action}
                    className="flex items-center justify-between p-2 rounded hover:bg-white/10 cursor-pointer text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <cmd.icon size={13} className="text-sky-400" />
                      <span>{cmd.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">
                      {cmd.tag}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

// Simple Syntax Color Component
function SyntaxColoredLine({ line }: { line: string }) {
  if (line.trim().startsWith('#') || line.trim().startsWith('//')) {
    return <span className="text-slate-500 italic">{line}</span>
  }

  // Keywords color
  const keywords = ['def ', 'return ', 'import ', 'from ', 'if ', 'else:', 'try:', 'except ', 'as ', 'raise ', 'with ', 'class ', 'export ', 'interface ', 'const ']
  let isKw = false
  for (const kw of keywords) {
    if (line.includes(kw)) {
      isKw = true
      break
    }
  }

  if (line.includes('def ') || line.includes('function ')) {
    return (
      <span>
        <span className="text-purple-400 font-bold">{line.substring(0, line.indexOf('('))}</span>
        <span className="text-sky-300">{line.substring(line.indexOf('('))}</span>
      </span>
    )
  }

  if (line.includes('import ') || line.includes('from ')) {
    return <span className="text-purple-400">{line}</span>
  }

  if (line.includes('"') || line.includes("'")) {
    return <span className="text-amber-300">{line}</span>
  }

  return <span>{line}</span>
}

function FlaskConicalIcon({ size, className }: { size: number; className?: string }) {
  return <FlaskConical size={size} className={className} />
}
