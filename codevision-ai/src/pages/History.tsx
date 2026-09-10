import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, GitPullRequest, Clock, FileCode, RefreshCw } from 'lucide-react'
import AppShell from '../components/AppShell'
import { api } from '../services/api'

const fallbackHistory = [
  { id: 'pr1', repo: 'medilink-api', pr: '#248', title: 'Add patient lookup endpoint', score: 78, status: 'In review', date: 'Today, 10:24 AM', issues: 6 },
  { id: 'pr2', repo: 'transit-tracker-web', pr: '#61', title: 'Live map marker clustering', score: 94, status: 'Approved', date: 'Yesterday, 4:10 PM', issues: 1 },
  { id: 'pr3', repo: 'civic-report-system', pr: '#33', title: 'Complaint status workflow', score: 65, status: 'Changes requested', date: '2 days ago', issues: 9 },
  { id: 'pr4', repo: 'traventure-frontend', pr: '#19', title: 'Booking checkout redesign', score: 89, status: 'Approved', date: '4 days ago', issues: 2 },
  { id: 'pr5', repo: 'medilink-api', pr: '#241', title: 'Refactor auth validation', score: 91, status: 'Approved', date: '5 days ago', issues: 1 },
]

const statusStyle: Record<string, string> = {
  'In review': 'bg-sky-500/10 text-sky-400 border-sky-400/30',
  Approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  'Changes requested': 'bg-red-500/10 text-red-400 border-red-500/30',
}

export default function History() {
  const [historyItems, setHistoryItems] = useState<any[]>(fallbackHistory)
  const [loading, setLoading] = useState(false)

  const loadHistory = async () => {
    setLoading(true)
    try {
      const real = await api.getHistory()
      if (real && real.length > 0) {
        const formatted = real.map(h => ({
          id: h.id,
          repo: h.language || 'Python',
          pr: 'Direct Scan',
          title: `Analyzed ${h.title}`,
          score: h.score,
          status: h.findings_count === 0 ? 'Approved' : 'In review',
          date: h.created_at,
          issues: h.findings_count
        }))
        setHistoryItems([...formatted, ...fallbackHistory])
      }
    } catch {
      setHistoryItems(fallbackHistory)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  return (
    <AppShell title="Review History" subtitle="Audit logs of past code reviews, scans, and pull requests">
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-mono text-ink-low uppercase tracking-wider">
          Complete Audit Trail
        </span>
        <button
          onClick={loadHistory}
          disabled={loading}
          className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Refreshing…' : 'Sync History'}
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_100px_120px_140px_140px] gap-4 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-ink-low border-b border-base-border bg-base-surface2/40">
          <span>Review Target</span>
          <span>Issues</span>
          <span>Health Score</span>
          <span>Status</span>
          <span>Date</span>
        </div>
        <div className="flex flex-col divide-y divide-base-border">
          {historyItems.map((h, i) => (
            <motion.div
              key={h.id + i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="grid md:grid-cols-[1fr_100px_120px_140px_140px] gap-2 md:gap-4 px-6 py-4 items-center hover:bg-base-surface2/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-base-surface2 border border-base-border flex items-center justify-center text-sky-400 shrink-0">
                  <FileCode size={15} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink-hi truncate">{h.title}</p>
                  <p className="text-xs text-ink-low font-mono">{h.repo} • {h.pr}</p>
                </div>
              </div>
              <span className="text-sm text-ink-mid">{h.issues} found</span>
              <div className="flex items-center gap-2">
                <div className="w-14 h-1.5 rounded-full bg-base-surface2 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-purple-500" style={{ width: `${h.score}%` }} />
                </div>
                <span className="font-mono text-xs font-semibold text-ink-hi">{h.score}</span>
              </div>
              <span className={`pill border w-fit text-[11px] ${statusStyle[h.status] || 'bg-base-surface2 text-ink-mid border-base-border'}`}>
                {h.status === 'Approved' ? <CheckCircle2 size={12} /> : <Clock size={12} />} {h.status}
              </span>
              <span className="text-xs text-ink-low">{h.date}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
