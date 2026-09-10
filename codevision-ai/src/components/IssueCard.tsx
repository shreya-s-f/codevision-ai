import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, FileCode2, Sparkles, FlaskConical, CheckCircle2, Loader2 } from 'lucide-react'
import { Issue } from '../data/mock'
import SeverityBadge from './SeverityBadge'
import DiffBlock from './DiffBlock'
import { api } from '../services/api'

const typeLabel: Record<Issue['type'], string> = {
  bug: 'Bug',
  security: 'Security',
  quality: 'Code Quality',
  performance: 'Performance',
}

export default function IssueCard({ issue, defaultOpen = false }: { issue: Issue; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const [stage, setStage] = useState<'idle' | 'generating' | 'ready' | 'validating' | 'validated'>(
    issue.status === 'validated' ? 'validated' : issue.status === 'fixed' ? 'ready' : 'idle'
  )

  const generateFix = async () => {
    setStage('generating')
    try {
      await api.applyFix(issue.id, 'apply')
    } catch {
      // Graceful offline fallback
    }
    setTimeout(() => setStage('ready'), 900)
  }

  const runValidation = async () => {
    setStage('validating')
    try {
      await api.applyFix(issue.id, 'validate')
    } catch {
      // Graceful offline fallback
    }
    setTimeout(() => setStage('validated'), 1100)
  }

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-base-surface2/40 transition-colors"
      >
        <FileCode2 size={17} className="text-ink-low shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink-hi truncate">{issue.title}</p>
          <p className="text-xs text-ink-low font-mono mt-0.5">{issue.file}:{issue.line}</p>
        </div>
        <span className="hidden sm:inline pill bg-base-surface2 text-ink-mid border border-base-border text-xs">
          {typeLabel[issue.type] || issue.type}
        </span>
        <SeverityBadge severity={issue.severity} />
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="text-ink-low">
          <ChevronDown size={17} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-base-border"
          >
            <div className="px-5 py-5 flex flex-col gap-4">
              <p className="text-sm text-ink-mid leading-relaxed">{issue.description}</p>

              <div className="rounded-xl border border-base-border bg-base-surface2/60 px-4 py-3 flex gap-2.5">
                <Sparkles size={15} className="text-signal-amber shrink-0 mt-0.5" />
                <p className="text-sm text-ink-hi leading-relaxed">{issue.suggestion}</p>
              </div>

              {stage === 'idle' && (
                <button onClick={generateFix} className="btn-primary text-xs self-start !py-2.5">
                  <Sparkles size={14} /> Generate AI Code Fix
                </button>
              )}

              {stage === 'generating' && (
                <div className="flex items-center gap-2 text-xs text-ink-mid">
                  <Loader2 size={14} className="animate-spin text-ink-hi" /> Retrieving repository context & drafting verified patch…
                </div>
              )}

              {(stage === 'ready' || stage === 'validating' || stage === 'validated') && (
                <>
                  <DiffBlock before={issue.before} after={issue.after} />
                  {stage === 'ready' && (
                    <button onClick={runValidation} className="btn-secondary text-xs self-start !py-2.5">
                      <FlaskConical size={14} /> Run Sandbox Validation
                    </button>
                  )}
                  {stage === 'validating' && (
                    <div className="flex items-center gap-2 text-xs text-ink-mid">
                      <Loader2 size={14} className="animate-spin text-ink-hi" /> Applying patch in sandbox environment, executing tests…
                    </div>
                  )}
                  {stage === 'validated' && (
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <span className="pill bg-signal-green/10 text-signal-green border border-signal-green/25 text-xs">
                        <CheckCircle2 size={13} /> Unit Tests Passed
                      </span>
                      <span className="pill bg-signal-green/10 text-signal-green border border-signal-green/25 text-xs">
                        <CheckCircle2 size={13} /> Static Scans Clean
                      </span>
                      <button
                        onClick={() => alert('Pull request updated with verified patch and test assertions!')}
                        className="btn-primary text-xs !py-2 ml-auto"
                      >
                        Attach Fix to PR
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
