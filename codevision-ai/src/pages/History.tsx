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
  const [activeTab, setActiveTab] = useState<'scans' | 'prs'>('scans')
  const [historyItems, setHistoryItems] = useState<any[]>(fallbackHistory)
  const [pullRequests, setPullRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [reviewingPr, setReviewingPr] = useState<number | null>(null)
  const [prResult, setPrResult] = useState<any | null>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [realHistory, realPrs] = await Promise.all([
        api.getHistory().catch(() => null),
        api.getPullRequests().catch(() => null),
      ])

      if (realHistory && realHistory.length > 0) {
        const formatted = realHistory.map(h => ({
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

      if (realPrs && realPrs.length > 0) {
        setPullRequests(realPrs)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReviewPr = async (prNumber: number, repoName: string) => {
    setReviewingPr(prNumber)
    try {
      const res = await api.reviewPullRequest(repoName, prNumber, true)
      setPrResult(res)
    } finally {
      setReviewingPr(null)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <AppShell title="Review History" subtitle="Audit logs of past code reviews, scans, and pull requests">
      {/* TABS */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-base-surface2 border border-base-border">
          <button
            onClick={() => setActiveTab('scans')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'scans' ? 'bg-base-bg text-sky-400 shadow-xs' : 'text-ink-mid hover:text-ink-hi'
            }`}
          >
            Review Runs ({historyItems.length})
          </button>
          <button
            onClick={() => setActiveTab('prs')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'prs' ? 'bg-base-bg text-purple-400 shadow-xs' : 'text-ink-mid hover:text-ink-hi'
            }`}
          >
            <GitPullRequest size={13} />
            GitHub Pull Requests ({pullRequests.length || 2})
          </button>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Refreshing…' : 'Sync History'}
        </button>
      </div>

      {/* PR REVIEW RESULT BANNER */}
      {prResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4.5 mb-5 border-emerald-500/30 bg-emerald-500/10 text-ink-hi"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Automated PR Review Posted to PR #{prResult.pr_number}
              </p>
              <p className="text-xs text-ink-mid mt-1 font-mono">
                Quality Score: {prResult.score}/100 • Findings: {prResult.findings?.length || 0}
              </p>
              <pre className="text-[11px] font-mono bg-base-bg p-2 rounded-lg mt-2 border border-base-border whitespace-pre-wrap">
                {prResult.comment_posted}
              </pre>
            </div>
            <button
              onClick={() => setPrResult(null)}
              className="text-xs text-ink-low hover:text-ink-hi ml-4"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}

      {/* PR TAB VIEW */}
      {activeTab === 'prs' && (
        <div className="grid gap-4 mb-6">
          {(pullRequests.length > 0 ? pullRequests : [
            {
              pr_id: "pr_101",
              repo_name: "shreya/medilink-api",
              pr_number: 248,
              title: "feat: Add patient lookup endpoint and auth validation",
              author: "shreya",
              status: "open",
              score: 78,
              issues_found: 3,
            },
            {
              pr_id: "pr_102",
              repo_name: "shreya/transit-tracker-web",
              pr_number: 62,
              title: "fix: Live map marker clustering debounce optimization",
              author: "shreya",
              status: "open",
              score: 94,
              issues_found: 0,
            }
          ]).map((pr) => (
            <div key={pr.pr_id} className="card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                  <GitPullRequest size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-sky-400 font-semibold">{pr.repo_name} #{pr.pr_number}</span>
                    <span className="pill bg-purple-500/10 text-purple-400 border border-purple-400/30 text-[10px] uppercase">Open PR</span>
                  </div>
                  <h3 className="text-sm font-semibold text-ink-hi mt-1">{pr.title}</h3>
                  <p className="text-xs text-ink-low mt-0.5">Author: @{pr.author} • Health: {pr.score}/100 • {pr.issues_found} potential defects</p>
                </div>
              </div>
              <button
                onClick={() => handleReviewPr(pr.pr_number, pr.repo_name)}
                disabled={reviewingPr === pr.pr_number}
                className="btn-primary text-xs !py-2 !px-4 flex items-center gap-1.5 shrink-0"
              >
                {reviewingPr === pr.pr_number ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" /> Running Automated Review…
                  </>
                ) : (
                  <>
                    <GitPullRequest size={13} /> Run Review & Post Comment
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* SCAN RUNS TABLE VIEW */}
      {activeTab === 'scans' && (
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
      )}
    </AppShell>
  )
}
