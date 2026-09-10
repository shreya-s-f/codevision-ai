import { motion } from 'framer-motion'
import { CheckCircle2, GitPullRequest, Clock } from 'lucide-react'
import AppShell from '../components/AppShell'

const history = [
  { id: 'pr1', repo: 'medilink-api', pr: '#248', title: 'Add patient lookup endpoint', score: 78, status: 'In review', date: 'Today, 10:24 AM', issues: 6 },
  { id: 'pr2', repo: 'transit-tracker-web', pr: '#61', title: 'Live map marker clustering', score: 94, status: 'Approved', date: 'Yesterday, 4:10 PM', issues: 1 },
  { id: 'pr3', repo: 'civic-report-system', pr: '#33', title: 'Complaint status workflow', score: 65, status: 'Changes requested', date: '2 days ago', issues: 9 },
  { id: 'pr4', repo: 'traventure-frontend', pr: '#19', title: 'Booking checkout redesign', score: 89, status: 'Approved', date: '4 days ago', issues: 2 },
  { id: 'pr5', repo: 'medilink-api', pr: '#241', title: 'Refactor auth validation', score: 91, status: 'Approved', date: '5 days ago', issues: 1 },
]

const statusStyle: Record<string, string> = {
  'In review': 'bg-blue/10 text-blue-glow border-blue/25',
  Approved: 'bg-signal-green/10 text-signal-green border-signal-green/25',
  'Changes requested': 'bg-signal-red/10 text-signal-red border-signal-red/25',
}

export default function History() {
  return (
    <AppShell title="Review History" subtitle="Past pull request reviews across all repositories">
      <div className="card overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_100px_120px_140px_120px] gap-4 px-6 py-3.5 text-xs text-ink-low border-b border-base-border">
          <span>Pull request</span>
          <span>Issues</span>
          <span>Score</span>
          <span>Status</span>
          <span>Reviewed</span>
        </div>
        <div className="flex flex-col divide-y divide-base-border">
          {history.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="grid md:grid-cols-[1fr_100px_120px_140px_120px] gap-2 md:gap-4 px-6 py-4 items-center hover:bg-base-surface2/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <GitPullRequest size={16} className="text-violet-glow shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-ink-hi truncate">{h.title}</p>
                  <p className="text-xs text-ink-low font-mono">{h.repo} {h.pr}</p>
                </div>
              </div>
              <span className="text-sm text-ink-mid">{h.issues} found</span>
              <div className="flex items-center gap-2">
                <div className="w-14 h-1.5 rounded-full bg-base-surface2 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue to-violet" style={{ width: `${h.score}%` }} />
                </div>
                <span className="font-mono text-xs text-ink-mid">{h.score}</span>
              </div>
              <span className={`pill border w-fit ${statusStyle[h.status]}`}>
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
