import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, FlaskConical, GitPullRequest, RefreshCw } from 'lucide-react'
import AppShell from '../components/AppShell'
import IssueCard from '../components/IssueCard'
import { api, ReviewItem } from '../services/api'
import { issues as mockIssues } from '../data/mock'

const steps = [
  { icon: Sparkles, title: 'Fix generation', desc: 'CodeVision AI synthesizes a targeted code patch based on detected issues.' },
  { icon: FlaskConical, title: 'Sandbox validation', desc: 'The fix is analyzed in an isolated environment and tested for regression risks.' },
  { icon: GitPullRequest, title: 'Patch Application', desc: 'Once validated, apply the change with 1 click directly into your codebase.' },
]

export default function Fixes() {
  const [findings, setFindings] = useState<ReviewItem[]>(mockIssues)
  const [loading, setLoading] = useState(false)

  const loadFindings = async () => {
    setLoading(true)
    try {
      const data = await api.getReviews()
      if (data && data.length > 0) setFindings(data)
    } catch {
      setFindings(mockIssues)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFindings()
  }, [])

  return (
    <AppShell title="AI Code Fixes" subtitle="Generate, review, and validate suggested code changes">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-mono text-ink-low uppercase tracking-wider">
          Automated Patch Engine
        </span>
        <button
          onClick={loadFindings}
          disabled={loading}
          className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Refreshing…' : 'Sync Patches'}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="card p-5 flex gap-3.5 border-sky-400/20 hover:border-sky-400/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-purple-500/20 border border-sky-400/30 flex items-center justify-center shrink-0">
              <s.icon size={17} className="text-sky-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-hi mb-1">{s.title}</p>
              <p className="text-xs text-ink-mid leading-relaxed">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {findings.map((issue, i) => (
          <motion.div
            key={issue.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
          >
            <IssueCard issue={issue} defaultOpen={issue.status !== 'open'} />
          </motion.div>
        ))}
      </div>
    </AppShell>
  )
}
