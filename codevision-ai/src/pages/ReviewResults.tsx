import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Bug, ShieldAlert, Gauge, Layers, ListFilter, RefreshCw, ShieldCheck } from 'lucide-react'
import AppShell from '../components/AppShell'
import IssueCard from '../components/IssueCard'
import { api, ReviewItem } from '../services/api'
import { issues as mockIssues } from '../data/mock'

const typeFilters: { key: string; label: string; icon: any }[] = [
  { key: 'all', label: 'All Categories', icon: ListFilter },
  { key: 'security', label: 'Security', icon: ShieldAlert },
  { key: 'bug', label: 'Bugs', icon: Bug },
  { key: 'performance', label: 'Performance', icon: Gauge },
  { key: 'quality', label: 'Quality', icon: Layers },
]

const severityFilters = ['all', 'critical', 'high', 'medium', 'low']

export default function ReviewResults() {
  const [filter, setFilter] = useState<string>('all')
  const [sevFilter, setSevFilter] = useState<string>('all')
  const [findings, setFindings] = useState<ReviewItem[]>(mockIssues)
  const [loading, setLoading] = useState(false)

  const loadFindings = async () => {
    setLoading(true)
    try {
      const data = await api.getReviews(sevFilter, filter)
      if (data && data.length > 0) setFindings(data)
    } catch {
      // Fallback
      setFindings(mockIssues)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFindings()
  }, [filter, sevFilter])

  const filtered = useMemo(() => {
    return findings.filter((i) => {
      const matchesType = filter === 'all' || i.type === filter
      const matchesSev = sevFilter === 'all' || i.severity === sevFilter
      return matchesType && matchesSev
    })
  }, [findings, filter, sevFilter])

  return (
    <AppShell
      title="Review Results"
      subtitle="medilink-api • pull request #248 • static analysis + security + AI review"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {typeFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`pill border transition-colors ${
                filter === f.key
                  ? 'bg-base-surface text-ink-hi border-ink-mid font-semibold'
                  : 'bg-base-surface2 border-base-border text-ink-mid hover:text-ink-hi'
              }`}
            >
              <f.icon size={13} /> {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-low font-mono">Severity:</span>
          <select
            value={sevFilter}
            onChange={(e) => setSevFilter(e.target.value)}
            className="text-xs bg-base-surface2 border border-base-border rounded-lg px-2.5 py-1 text-ink-hi outline-none uppercase font-mono"
          >
            {severityFilters.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={loadFindings}
            className="p-1.5 rounded-lg border border-base-border bg-base-surface2 text-ink-mid hover:text-ink-hi"
            title="Refresh findings"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4"
      >
        {filtered.map((issue, i) => (
          <motion.div
            key={issue.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
          >
            <IssueCard issue={issue} defaultOpen={i === 0} />
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="card p-12 text-center text-sm text-ink-mid">
            No issues match the selected filter criteria.
          </div>
        )}
      </motion.div>
    </AppShell>
  )
}
