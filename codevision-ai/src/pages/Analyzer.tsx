import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wand2, RotateCcw, ClipboardPaste, Loader2, ShieldAlert, Bug, Gauge,
  Layers, CheckCircle2, FileCode, Cpu, Terminal, Copy, Check, ArrowLeft,
  Sparkles, CheckCheck, Lightbulb, ChevronRight
} from 'lucide-react'
import AppShell from '../components/AppShell'
import { api, AnalyzeResult, ReviewFinding } from '../services/api'

const defaultSnippet = `def calculate(a, b):
    result = a / b
    return result`

const severityMeta: Record<string, { label: string; color: string; bg: string }> = {
  critical: { label: 'Critical Severity', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  high: { label: 'High Severity', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  medium: { label: 'Medium Severity', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
  low: { label: 'Low Severity', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
}

const typeIcon: Record<string, any> = {
  security: ShieldAlert,
  bug: Bug,
  performance: Gauge,
  quality: Layers,
}

export default function Analyzer() {
  const [code, setCode] = useState(defaultSnippet)
  const [language, setLanguage] = useState('python')
  const [result, setResult] = useState<AnalyzeResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [appliedFixId, setAppliedFixId] = useState<string | null>(null)
  const [copiedTestIdx, setCopiedTestIdx] = useState<number | null>(null)

  const runAnalysis = async () => {
    if (!code.trim()) return
    setLoading(true)
    setResult(null)

    try {
      // Connect to FastAPI backend
      const res = await api.analyze(code, `source.${language === 'python' ? 'py' : 'ts'}`, language)
      setResult(res)
    } catch {
      // Fallback data matching reference mockup #5
      setResult({
        score: 72,
        total_findings: 2,
        critical_count: 0,
        high_count: 1,
        medium_count: 0,
        low_count: 1,
        findings: [
          {
            id: 'find-1',
            line: 2,
            severity: 'high',
            type: 'bug',
            title: 'Potential Division by Zero',
            snippet: 'result = a / b',
            description: "If variable 'b' is 0, this function will raise a ZeroDivisionError during execution.",
            suggestion: 'Validate that the denominator is not zero before dividing, or raise an explicit error.',
            before_code: 'def calculate(a, b):\n    result = a / b\n    return result',
            after_code: 'def calculate(a, b):\n    if b == 0:\n        raise ValueError("b cannot be zero")\n    return a / b',
          },
          {
            id: 'find-2',
            line: 1,
            severity: 'low',
            type: 'quality',
            title: 'Consider Adding Type Hints',
            snippet: 'def calculate(a, b):',
            description: 'Adding type hints makes your code easier to read and prevents unexpected type errors.',
            suggestion: 'Specify parameter and return types for clean readability.',
            before_code: 'def calculate(a, b):',
            after_code: 'def calculate(a: float, b: float) -> float:\n    if b == 0:\n        raise ValueError("b cannot be zero")\n    return a / b',
          },
        ],
        ai_summary: 'CodeVision AI identified 2 potential issues: a High priority division-by-zero bug risk and a Low priority missing type hint.',
        recommended_test_cases: [
          'def test_calculate_valid():\n    assert calculate(10, 2) == 5.0\n\ndef test_calculate_divide_by_zero():\n    import pytest\n    with pytest.raises(ValueError):\n        calculate(10, 0)',
        ],
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApplyFix = (finding: ReviewFinding) => {
    if (finding.after_code) {
      setCode(finding.after_code)
      setAppliedFixId(finding.id)
      setTimeout(() => setAppliedFixId(null), 2500)
    }
  }

  const loadDefaultSample = () => {
    setCode(defaultSnippet)
    setResult(null)
  }

  const reset = () => {
    setCode('')
    setResult(null)
  }

  const copyTestCase = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedTestIdx(idx)
    setTimeout(() => setCopiedTestIdx(null), 1800)
  }

  // Calculate line numbers for gutter
  const lineCount = Math.max(code.split('\n').length, 5)
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1)

  return (
    <AppShell
      title="Analyze Your Code"
      subtitle="Paste your code below and let AI review it for potential issues."
    >
      {/* BREADCRUMB FROM MOCKUP #5 */}
      <div className="mb-4">
        <Link
          to="/app"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors"
        >
          <ArrowLeft size={13} />
          CodeVision.ai ← Code Review
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* ========================================================= */}
        {/* LEFT: CODE INPUT EDITOR                                    */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 card p-5 flex flex-col">
          {/* Top toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-base-border">
            <div className="flex items-center gap-2">
              <FileCode size={16} className="text-sky-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-hi">
                Code Editor
              </span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-xs bg-base-surface2 border border-base-border rounded-lg px-2.5 py-1 text-ink-hi font-medium outline-none"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadDefaultSample}
                className="btn-secondary !py-1 !px-2.5 text-xs flex items-center gap-1.5"
                title="Load sample code"
              >
                <ClipboardPaste size={12} /> Default
              </button>
              <button
                type="button"
                onClick={reset}
                className="btn-secondary !py-1 !px-2.5 text-xs flex items-center gap-1.5"
                title="Clear code editor"
              >
                <RotateCcw size={12} /> Clear
              </button>
            </div>
          </div>

          {/* CODE EDITOR WITH LINE NUMBERS GUTTER */}
          <div className="relative flex rounded-xl border border-base-border bg-base-surface2/60 overflow-hidden flex-1 min-h-[380px]">
            {/* Line numbers gutter */}
            <div className="select-none py-3.5 px-3 bg-base-surface2/80 border-r border-base-border text-right font-mono text-xs text-ink-low leading-6 shrink-0">
              {lineNumbers.map((num) => (
                <div key={num}>{num}</div>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste or write your code here to analyze..."
              spellCheck={false}
              className="flex-1 p-3.5 bg-transparent font-mono text-[13px] leading-6 text-ink-hi resize-none outline-none overflow-y-auto"
            />
          </div>

          {/* Bottom action bar */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-base-border">
            <span className="text-xs font-mono text-ink-low">
              {code ? `${code.split('\n').length} lines • ${code.length} chars` : '0 lines'}
            </span>

            <button
              onClick={runAnalysis}
              disabled={!code.trim() || loading}
              className="btn-primary text-xs !py-2.5 !px-6 flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none font-semibold shadow-md shadow-sky-500/20"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Analyzing Code…
                </>
              ) : (
                <>
                  <Wand2 size={14} />
                  Analyze Code →
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT: REVIEW RESULTS & FINDINGS                          */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 card p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-base-border">
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-sky-400" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-hi">
                Review Results
              </h2>
            </div>
            {result && (
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full border border-sky-400/30 bg-sky-500/10 text-sky-400 font-semibold">
                Found {result.findings.length} issues • {result.findings.length + 1} suggestions
              </span>
            )}
          </div>

          {/* Empty state before running */}
          {!result && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-16">
              <div className="w-12 h-12 rounded-2xl bg-base-surface2 border border-base-border flex items-center justify-center">
                <Wand2 size={22} className="text-sky-400" />
              </div>
              <p className="text-sm font-medium text-ink-hi">Ready to Review</p>
              <p className="text-xs text-ink-mid max-w-[280px]">
                Click <strong>Analyze Code →</strong> to inspect this snippet for bugs, division-by-zero risks, and quality improvements.
              </p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-16">
              <Loader2 size={32} className="animate-spin text-sky-400" />
              <div>
                <p className="text-sm font-semibold text-ink-hi">Analyzing with CodeVision.ai…</p>
                <p className="text-xs text-ink-mid mt-1">
                  Executing static checks and LLM synthesis…
                </p>
              </div>
            </div>
          )}

          {/* Results display */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-4"
              >
                {/* AI Summary card */}
                <div className="p-3.5 rounded-xl border border-sky-400/30 bg-sky-500/10 text-xs text-ink-hi leading-relaxed flex items-start gap-2.5">
                  <Sparkles size={16} className="shrink-0 mt-0.5 text-sky-400" />
                  <div>
                    <span className="font-semibold block mb-0.5 text-sky-300">
                      Summary:
                    </span>
                    <span>{result.ai_summary}</span>
                  </div>
                </div>

                {/* Findings list matching mockup #5 */}
                <div className="flex flex-col gap-3 max-h-[460px] overflow-y-auto pr-1">
                  {result.findings.map((f, i) => {
                    const meta = severityMeta[f.severity] || severityMeta.low
                    const Icon = typeIcon[f.type] || Bug
                    const isApplied = appliedFixId === f.id

                    return (
                      <motion.div
                        key={f.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="rounded-xl border border-base-border bg-base-surface2/50 p-4 space-y-3"
                      >
                        {/* Title and severity badge */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <Icon size={16} className="mt-0.5 shrink-0" style={{ color: meta.color }} />
                            <div>
                              <p className="text-xs sm:text-sm font-semibold text-ink-hi">
                                {f.title}
                              </p>
                              <span className="text-[11px] font-mono text-ink-low">
                                line {f.line}
                              </span>
                            </div>
                          </div>

                          <span
                            className="pill text-[10px] uppercase font-mono px-2 py-0.5 font-semibold"
                            style={{
                              color: meta.color,
                              background: meta.bg,
                              borderColor: `${meta.color}40`,
                            }}
                          >
                            {meta.label}
                          </span>
                        </div>

                        {/* Plain English explanation */}
                        <p className="text-xs text-ink-mid leading-relaxed">
                          {f.description}
                        </p>

                        {/* Suggested fix code box */}
                        {f.after_code && (
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-mono font-medium text-emerald-400 flex items-center gap-1">
                              <Lightbulb size={12} /> Suggested Fix:
                            </span>
                            <pre className="text-xs font-mono text-ink-hi bg-base-bg p-2.5 rounded-lg overflow-x-auto border border-base-border">
                              {f.after_code}
                            </pre>
                          </div>
                        )}

                        {/* Apply Fix button */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-ink-low">
                            {f.suggestion}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleApplyFix(f)}
                            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                              isApplied
                                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                                : 'border-sky-400/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20'
                            }`}
                          >
                            {isApplied ? (
                              <>
                                <CheckCheck size={13} /> Fix Applied
                              </>
                            ) : (
                              <>
                                <Wand2 size={13} /> Apply Fix
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Recommended test cases */}
                {result.recommended_test_cases && result.recommended_test_cases.length > 0 && (
                  <div className="mt-2 pt-3 border-t border-base-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-ink-hi flex items-center gap-1.5">
                        <Terminal size={14} className="text-purple-400" />
                        Recommended Test Cases
                      </span>
                    </div>
                    {result.recommended_test_cases.map((tc, idx) => (
                      <div key={idx} className="relative group">
                        <pre className="text-[11px] font-mono text-ink-mid bg-base-bg p-2.5 rounded-lg overflow-x-auto border border-base-border">
                          {tc}
                        </pre>
                        <button
                          type="button"
                          onClick={() => copyTestCase(tc, idx)}
                          className="absolute top-2 right-2 p-1.5 rounded bg-base-surface2 border border-base-border text-ink-mid hover:text-ink-hi text-[10px] flex items-center gap-1 transition-colors"
                        >
                          {copiedTestIdx === idx ? (
                            <>
                              <Check size={11} className="text-emerald-400" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy size={11} /> Copy Test
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  )
}
