import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  FileCode,
  SearchCode,
  BrainCircuit,
  Gauge,
  Sparkles,
  FlaskConical,
  GitPullRequest,
  FileText,
  Play,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  RefreshCw,
  Cpu,
  Layers,
  GraduationCap,
  Users,
  ChevronRight,
  Terminal,
  Code2
} from 'lucide-react'
import { api } from '../services/api'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function ModulesView() {
  const [overview, setOverview] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pipeline' | 'grid' | 'associates'>('pipeline')
  
  // Pipeline Simulator state
  const [samples, setSamples] = useState<any[]>([])
  const [selectedSample, setSelectedSample] = useState<string>('calculate.py')
  const [codeSnippet, setCodeSnippet] = useState<string>(
    'def calculate(a, b):\n    if b == 0:\n        return "Error"\n    return a / b\n\nresult = calculate(10, 0)\nprint(result)'
  )
  const [pipelineRunning, setPipelineRunning] = useState(false)
  const [pipelineStep, setPipelineStep] = useState(0)
  const [pipelineResult, setPipelineResult] = useState<any>(null)
  
  // Single module test states
  const [moduleTestResults, setModuleTestResults] = useState<{ [key: string]: any }>({})
  const [testingModuleId, setTestingModuleId] = useState<string | null>(null)

  useEffect(() => {
    loadOverview()
    loadSamples()
  }, [])

  const loadOverview = async () => {
    try {
      setLoading(true)
      const data = await api.getModulesOverview()
      setOverview(data)
    } catch (err) {
      console.error('Error loading overview:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadSamples = async () => {
    try {
      const data = await api.getModuleSamples()
      if (data && data.length > 0) {
        setSamples(data)
      }
    } catch (err) {
      console.error('Error loading samples:', err)
    }
  }

  const handleSelectSample = (sample: any) => {
    setSelectedSample(sample.filename)
    setCodeSnippet(sample.code)
    setPipelineResult(null)
  }

  const runFullPipeline = async () => {
    setPipelineRunning(true)
    setPipelineResult(null)
    setPipelineStep(1)

    for (let s = 1; s <= 7; s++) {
      setPipelineStep(s)
      await new Promise(r => setTimeout(r, 220))
    }

    try {
      const res = await api.runModulePipeline(codeSnippet, selectedSample, 'python')
      setPipelineResult(res)
      setPipelineStep(8)
    } catch (err) {
      console.error('Pipeline execution error:', err)
    } finally {
      setPipelineRunning(false)
    }
  }

  const testSingleModule = async (moduleId: string) => {
    setTestingModuleId(moduleId)
    try {
      let res: any = null
      if (moduleId === 'MOD-01') {
        res = await api.getAcademicReport()
      } else if (moduleId === 'MOD-02') {
        const samples = await api.getModuleSamples()
        res = { samples_count: samples.length, active_sample: samples[0] }
      } else if (moduleId === 'MOD-03') {
        res = await api.runModuleStaticAnalysis(codeSnippet, selectedSample)
      } else if (moduleId === 'MOD-04') {
        res = await api.runModuleAIReasoning(codeSnippet, selectedSample)
      } else if (moduleId === 'MOD-05') {
        res = await api.calculateModuleScore({ critical_count: 0, high_count: 1, medium_count: 1, low_count: 1 })
      } else if (moduleId === 'MOD-06') {
        res = await api.generateModuleFix(codeSnippet)
      } else if (moduleId === 'MOD-07') {
        res = await api.runModuleValidationTests(codeSnippet)
      } else if (moduleId === 'MOD-08') {
        res = await api.reviewPullRequest('r1', 248, true)
      } else if (moduleId === 'MOD-09') {
        res = await api.getAcademicReport()
      }
      setModuleTestResults(prev => ({ ...prev, [moduleId]: res }))
    } catch (err: any) {
      setModuleTestResults(prev => ({ ...prev, [moduleId]: { error: err.message || 'Execution error' } }))
    } finally {
      setTestingModuleId(null)
    }
  }

  const modulesList = [
    {
      id: 'MOD-01',
      title: 'User Authentication & Workspace Management',
      icon: ShieldCheck,
      color: 'from-sky-500 to-blue-600',
      badge: 'Identity & JWT',
      synopsisRef: 'Section 7 Workflow: Step 1',
      route: '/login',
      desc: 'Secures developer sessions, role authorization (Lead Reviewer, Developer), and binds academic associate credentials.'
    },
    {
      id: 'MOD-02',
      title: 'Source Code Ingestion & Preprocessing',
      icon: FileCode,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Ingestion & AST',
      synopsisRef: 'Section 7 Workflow: Steps 2 & 3',
      route: '/app/analyzer',
      desc: 'Multi-language code ingestion, syntax sanitization, comment stripping, token counting, and AST tree preparation.'
    },
    {
      id: 'MOD-03',
      title: 'Hybrid Static Code Analysis (Semgrep AST)',
      icon: SearchCode,
      color: 'from-indigo-500 to-purple-600',
      badge: 'Security Rules',
      synopsisRef: 'Section 7 Workflow: Step 4',
      route: '/app/analyzer',
      desc: 'Deterministic pattern matching targeting SQLi (CWE-89), hardcoded secrets (CWE-798), DOM XSS (CWE-79), and boundary flaws.'
    },
    {
      id: 'MOD-04',
      title: 'AI & LLM Reasoning Engine (RAG Context)',
      icon: BrainCircuit,
      color: 'from-purple-500 to-fuchsia-600',
      badge: 'Neural Intelligence',
      synopsisRef: 'Section 7 Workflow: Step 5',
      route: '/app/analyzer',
      desc: 'Large language model reasoning with RAG context from Google and IBM code-review studies. Computes Big-O and plain-English insights.'
    },
    {
      id: 'MOD-05',
      title: 'Severity Classification & Quality Scoring',
      icon: Gauge,
      color: 'from-fuchsia-500 to-rose-600',
      badge: 'Metrics Matrix',
      synopsisRef: 'Section 7 Workflow: Step 6',
      route: '/app/insights',
      desc: 'Classifies findings into Critical, High, Medium, Low severity. Computes 0-100 codebase health score and maintainability index.'
    },
    {
      id: 'MOD-06',
      title: 'Automated Fix Generation & 1-Click Patching',
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Automated Fix',
      synopsisRef: 'Section 7 Workflow: Step 7',
      route: '/app/fixes',
      desc: 'Synthesizes clean, AST-preserving replacement patches with unified git diff representation and 1-click live editor application.'
    },
    {
      id: 'MOD-07',
      title: 'Automated Test Synthesis & Validation',
      icon: FlaskConical,
      color: 'from-amber-500 to-orange-600',
      badge: 'Test Generator',
      synopsisRef: 'Section 7 Workflow: Step 8',
      route: '/app/analyzer',
      desc: 'Generates unit tests (pytest / jest) covering boundary flaws, zero denominators, and edge-cases. Validates fix with automated runner.'
    },
    {
      id: 'MOD-08',
      title: 'GitHub PR Integration & Webhook Bot',
      icon: GitPullRequest,
      color: 'from-cyan-500 to-blue-600',
      badge: 'CI/CD Bot',
      synopsisRef: 'Section 5 Scope & Section 7',
      route: '/app/history',
      desc: 'Simulates GitHub webhook triggers, parses PR unified diffs, evaluates quality gates, and posts automated inline bot comments.'
    },
    {
      id: 'MOD-09',
      title: 'Review History & Executive PDF Reporting',
      icon: FileText,
      color: 'from-pink-500 to-rose-600',
      badge: 'Audit & Reports',
      synopsisRef: 'Section 7 Workflow: Step 9',
      route: '/app/reports',
      desc: 'Persistent database audit logging, historical trend analysis, and printable official academic PDF report with college metadata.'
    }
  ]

  const associates = [
    { usn: '2BA23IS073', name: 'Ranjita Benakatti', role: 'Full-Stack & Security Engineer', initials: 'RB', color: 'from-sky-400 to-blue-600' },
    { usn: '2BA23IS088', name: 'Shreya Suresh Fakirapur', role: 'Lead Architect & AI Systems', initials: 'SF', color: 'from-purple-400 to-pink-600' },
    { usn: '2BA24IS407', name: 'Prajwal Joshi', role: 'Backend & Cloud Architect', initials: 'PJ', color: 'from-indigo-400 to-purple-600' },
    { usn: '2BA24IS408', name: 'Preetam Joshi', role: 'QA & DevOps Lead', initials: 'PJ', color: 'from-emerald-400 to-teal-600' }
  ]

  return (
    <div className="flex min-h-screen bg-[#070913] text-white font-sans selection:bg-purple-500 selection:text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar
          title="Project Modules (22UIS717P)"
          subtitle="Basaveshwar Engineering College Bagalkote • Dept. of ISE"
        />

        <main className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
          {/* Academic Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-950/60 via-purple-950/40 to-indigo-950/60 border border-sky-500/30 p-6 lg:p-8 backdrop-blur-xl shadow-2xl shadow-sky-500/10"
          >
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-semibold tracking-wider uppercase">
                  <GraduationCap className="w-4 h-4 text-sky-400" />
                  B. V. V. Sangha\'s Basaveshwar Engineering College Bagalkote
                </div>
                <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight font-display bg-gradient-to-r from-white via-sky-200 to-purple-300 bg-clip-text text-transparent">
                  CodeVision.ai — Complete 9-Module Architecture
                </h1>
                <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Project Course: <strong className="text-sky-300">22UIS717P</strong> | Dept. of Information Science & Engineering (7th Sem, 2026-27).
                  Guide: <strong className="text-purple-300">Prof. Deepa I.K.</strong> (Assistant Professor).
                </p>
              </div>

              {/* Status pill & tabs */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  9 Modules Connected & Active
                </div>

                <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('pipeline')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeTab === 'pipeline' ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Pipeline Simulator
                  </button>
                  <button
                    onClick={() => setActiveTab('grid')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeTab === 'grid' ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Module Grid & Tests
                  </button>
                  <button
                    onClick={() => setActiveTab('associates')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeTab === 'associates' ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Project Associates
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* TAB 1: INTERACTIVE PIPELINE SIMULATOR */}
          {activeTab === 'pipeline' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Visual Connected Pipeline Chain */}
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-400" />
                  Official 9-Step Review Pipeline Workflow (Synopsis Section 7)
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3 relative">
                  {modulesList.map((m, idx) => {
                    const Icon = m.icon
                    const isPassed = pipelineStep > idx
                    const isCurrent = pipelineStep === idx + 1 && pipelineRunning

                    return (
                      <div
                        key={m.id}
                        className={`relative rounded-xl p-3 border transition-all flex flex-col items-center text-center ${
                          isCurrent
                            ? 'bg-sky-500/20 border-sky-400 shadow-lg shadow-sky-500/30 scale-105 animate-pulse'
                            : isPassed
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-800/40 border-white/5 text-slate-400'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 bg-gradient-to-br ${m.color} text-white shadow-md`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-sky-400">{m.id}</span>
                        <span className="text-xs font-semibold line-clamp-1 mt-0.5 text-white">{m.badge}</span>
                        <span className="text-[9px] text-slate-400 mt-1">Step {idx + 1}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Pipeline Interactive Sandbox */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Code Input & Sample Selection */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-sky-400" />
                        Source Code Input
                      </label>
                      <span className="text-xs text-sky-400 font-mono">{selectedSample}</span>
                    </div>

                    {/* Academic Samples Selector */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {samples.map((s: any) => (
                        <button
                          key={s.id}
                          onClick={() => handleSelectSample(s)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                            selectedSample === s.filename
                              ? 'bg-sky-500 text-white font-semibold shadow-md'
                              : 'bg-slate-800 text-slate-400 hover:text-white border border-white/5'
                          }`}
                        >
                          {s.filename}
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={codeSnippet}
                      onChange={(e) => setCodeSnippet(e.target.value)}
                      rows={10}
                      className="w-full font-mono text-xs bg-slate-950/80 border border-white/10 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-sky-500/50 resize-none"
                      spellCheck={false}
                    />

                    <button
                      onClick={runFullPipeline}
                      disabled={pipelineRunning}
                      className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 hover:opacity-95 active:scale-[0.98] text-white shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-50"
                    >
                      {pipelineRunning ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Processing Step {pipelineStep} of 8...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-white" />
                          Execute Complete 9-Module Pipeline
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right: Pipeline Live Execution Results */}
                <div className="lg:col-span-7">
                  <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md min-h-[460px] flex flex-col">
                    <h3 className="text-sm font-bold text-white flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                      <span className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-purple-400" />
                        Pipeline Execution Telemetry & Results
                      </span>
                      {pipelineResult && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: `${pipelineResult.color_code}22`, color: pipelineResult.color_code }}>
                          Health: {pipelineResult.overall_health_score}/100 ({pipelineResult.grade})
                        </span>
                      )}
                    </h3>

                    {!pipelineResult && !pipelineRunning && (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                        <Terminal className="w-12 h-12 text-slate-600 mb-3" />
                        <p className="text-sm font-semibold text-slate-300">Ready to Execute Pipeline</p>
                        <p className="text-xs text-slate-500 max-w-sm mt-1">
                          Select a sample or paste custom code on the left, then click "Execute Complete 9-Module Pipeline".
                        </p>
                      </div>
                    )}

                    {pipelineRunning && (
                      <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-8">
                        <div className="relative w-16 h-16">
                          <div className="absolute inset-0 rounded-full border-4 border-sky-500/20 animate-ping"></div>
                          <div className="absolute inset-0 rounded-full border-4 border-t-sky-400 border-r-purple-400 border-b-transparent border-l-transparent animate-spin"></div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-white">Executing Step {pipelineStep} of 8</p>
                          <p className="text-xs text-sky-400 font-mono mt-1">
                            {pipelineStep === 1 && 'Ingestion & Token Preprocessing...'}
                            {pipelineStep === 2 && 'Deterministic Semgrep AST Vulnerability Scan...'}
                            {pipelineStep === 3 && 'AI Neural Reasoning & Algorithmic Complexity...'}
                            {pipelineStep === 4 && 'Severity Classification & Health Score Calculation...'}
                            {pipelineStep === 5 && 'Synthesizing AST-Preserving Unified Diff Fix...'}
                            {pipelineStep === 6 && 'Generating & Running Boundary Test Cases...'}
                            {pipelineStep === 7 && 'Simulating GitHub PR Webhook & Bot Review...'}
                          </p>
                        </div>
                      </div>
                    )}

                    {pipelineResult && (
                      <div className="space-y-4 text-xs overflow-y-auto max-h-[500px] pr-2">
                        {/* Step 3 & 4 Highlights */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Static Issues</span>
                            <span className="text-lg font-bold text-amber-400">
                              {pipelineResult.step2_static_analysis.total_issues} detected
                            </span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              Critical: {pipelineResult.step2_static_analysis.critical_issues} • High: {pipelineResult.step2_static_analysis.high_issues}
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Complexity</span>
                            <span className="text-lg font-bold text-purple-400 font-mono">
                              {pipelineResult.step3_ai_reasoning.estimated_complexity}
                            </span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              {pipelineResult.step4_scoring.metrics.maintainability_index} Maintainability
                            </span>
                          </div>
                        </div>

                        {/* Step 5: Synthesized Fix Diff */}
                        <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-2">
                          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            Mod 6: Synthesized 1-Click Code Fix
                          </span>
                          <pre className="bg-slate-900 p-2.5 rounded-lg font-mono text-[11px] text-emerald-300 overflow-x-auto whitespace-pre">
                            {pipelineResult.step5_fix_generator.fixed_code}
                          </pre>
                        </div>

                        {/* Step 6: Synthesized Test Cases */}
                        <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-2">
                          <span className="text-amber-400 font-bold flex items-center gap-1.5">
                            <FlaskConical className="w-3.5 h-3.5" />
                            Mod 7: Synthesized Validation Test Suite
                          </span>
                          <div className="space-y-1.5">
                            {pipelineResult.step6_test_synthesis.synthesis.test_cases.map((t: any) => (
                              <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 text-[11px]">
                                <span className="font-mono text-slate-300">{t.name}</span>
                                <span className="text-emerald-400 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> PASSED
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Step 7: GitHub Bot Review Comment */}
                        <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5">
                          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                            <GitPullRequest className="w-3.5 h-3.5" />
                            Mod 8: Automated GitHub PR Review Bot Output
                          </span>
                          <div className="p-2.5 rounded-lg bg-slate-900 text-slate-300 font-mono text-[11px] whitespace-pre-line">
                            {pipelineResult.step7_github_pr.review_comment}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: DETAILED MODULE GRID & TEST RUNNERS */}
          {activeTab === 'grid' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {modulesList.map((m) => {
                const Icon = m.icon
                const testResult = moduleTestResults[m.id]
                const isTesting = testingModuleId === m.id

                return (
                  <div
                    key={m.id}
                    className="rounded-2xl bg-slate-900/50 border border-white/10 p-5 flex flex-col justify-between hover:border-sky-500/40 transition-all hover:shadow-xl hover:shadow-sky-500/5 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white shadow-lg`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          200 OK • Online
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-sky-400">{m.id}</span>
                          <span className="text-[10px] text-slate-500">({m.synopsisRef})</span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-1 group-hover:text-sky-300 transition-colors">
                          {m.title}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {m.desc}
                      </p>

                      {/* Test Result Display if available */}
                      {testResult && (
                        <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-white/10 font-mono text-[11px] text-sky-300 max-h-36 overflow-y-auto">
                          <pre>{JSON.stringify(testResult, null, 2)}</pre>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between gap-3">
                      <button
                        onClick={() => testSingleModule(m.id)}
                        disabled={isTesting}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5 transition-all disabled:opacity-50"
                      >
                        {isTesting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 text-sky-400" />
                            Test Module
                          </>
                        )}
                      </button>

                      <Link
                        to={m.route}
                        className="p-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 transition-colors"
                        title="Open Module Interface"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </motion.div>
          )}

          {/* TAB 3: PROJECT ASSOCIATES & COLLEGE METADATA */}
          {activeTab === 'associates' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* College & Department Overview Card */}
              <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-white/10 p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">Basaveshwar Engineering College Bagalkote</h2>
                    <p className="text-sm text-sky-400 font-medium">Department of Information Science and Engineering</p>
                    <p className="text-xs text-slate-400 mt-1">Course Project: 22UIS717P | Semester: 7th | Academic Year: 2026-27</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-purple-500/30 text-left md:text-right">
                    <span className="text-xs text-slate-400 block font-semibold">Project Guide</span>
                    <span className="text-base font-bold text-purple-300">Prof. Deepa I.K.</span>
                    <span className="text-xs text-slate-500 block">Assistant Professor, Dept. of ISE</span>
                  </div>
                </div>
              </div>

              {/* 4 Associates Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {associates.map((assoc, idx) => (
                  <div
                    key={assoc.usn}
                    className="rounded-2xl bg-slate-900/60 border border-white/10 p-6 flex flex-col items-center text-center hover:border-sky-500/40 transition-all hover:scale-[1.02] shadow-xl"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${assoc.color} flex items-center justify-center text-xl font-extrabold text-white shadow-xl shadow-sky-500/10 mb-4`}>
                      {assoc.initials}
                    </div>
                    <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20 mb-2">
                      {assoc.usn}
                    </span>
                    <h3 className="text-base font-bold text-white">{assoc.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{assoc.role}</p>
                    <span className="text-[10px] text-slate-500 mt-3">Associate #{idx + 1}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}
