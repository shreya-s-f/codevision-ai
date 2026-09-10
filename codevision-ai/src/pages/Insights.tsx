import { motion } from 'framer-motion'
import AppShell from '../components/AppShell'
import { issues, repos, severityMeta, Severity } from '../data/mock'

const severities: Severity[] = ['critical', 'high', 'medium', 'low']
const types: { key: 'security' | 'bug' | 'performance' | 'quality'; label: string; color: string }[] = [
  { key: 'security', label: 'Security', color: '#FF5C7A' },
  { key: 'bug', label: 'Bug', color: '#7C93FF' },
  { key: 'performance', label: 'Performance', color: '#F5A623' },
  { key: 'quality', label: 'Quality', color: '#33D69F' },
]

function Donut({ data }: { data: { color: string; value: number; label: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  let acc = 0
  const R = 60
  const C = 2 * Math.PI * R

  return (
    <div className="flex items-center gap-6">
      <svg width="150" height="150" viewBox="0 0 150 150" className="-rotate-90">
        <circle cx="75" cy="75" r={R} fill="none" stroke="#181B36" strokeWidth="16" />
        {data.map((d, i) => {
          const frac = d.value / total
          const dash = frac * C
          const offset = acc * C
          acc += frac
          return (
            <motion.circle
              key={d.label}
              cx="75" cy="75" r={R} fill="none"
              stroke={d.color}
              strokeWidth="16"
              strokeDasharray={`${dash} ${C - dash}`}
              strokeDashoffset={-offset}
              initial={{ strokeDasharray: `0 ${C}` }}
              animate={{ strokeDasharray: `${dash} ${C - dash}` }}
              transition={{ duration: 1, delay: i * 0.15, ease: 'easeOut' }}
              strokeLinecap="butt"
            />
          )
        })}
      </svg>
      <div className="flex flex-col gap-2.5">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-sm">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
            <span className="text-ink-mid">{d.label}</span>
            <span className="text-ink-hi font-mono text-xs ml-auto">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Insights() {
  const bySeverity = severities.map((s) => ({
    label: severityMeta[s].label,
    color: severityMeta[s].color,
    value: issues.filter((i) => i.severity === s).length,
  }))

  const byType = types.map((t) => ({
    ...t,
    value: issues.filter((i) => i.type === t.key).length,
  }))
  const maxType = Math.max(...byType.map((t) => t.value), 1)

  const statusCounts = {
    open: issues.filter((i) => i.status === 'open').length,
    fixed: issues.filter((i) => i.status === 'fixed').length,
    validated: issues.filter((i) => i.status === 'validated').length,
  }
  const totalIssues = issues.length

  const avgScore = Math.round(repos.reduce((s, r) => s + r.score, 0) / repos.length)

  return (
    <AppShell title="Insights" subtitle="Trends across every connected repository, computed from current findings">
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="card p-5">
          <p className="text-xs text-ink-low mb-2">Total findings</p>
          <p className="text-2xl font-display font-semibold text-ink-hi">{totalIssues}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-ink-low mb-2">Average review score</p>
          <p className="text-2xl font-display font-semibold text-ink-hi">{avgScore}<span className="text-ink-low text-base">/100</span></p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-ink-low mb-2">Resolution rate</p>
          <p className="text-2xl font-display font-semibold text-ink-hi">
            {Math.round(((statusCounts.fixed + statusCounts.validated) / totalIssues) * 100)}%
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="card p-6">
          <h2 className="font-display font-semibold text-ink-hi mb-6">Findings by severity</h2>
          <Donut data={bySeverity} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="card p-6">
          <h2 className="font-display font-semibold text-ink-hi mb-6">Findings by category</h2>
          <div className="flex flex-col gap-4">
            {byType.map((t, i) => (
              <div key={t.key}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-ink-mid">{t.label}</span>
                  <span className="font-mono text-xs text-ink-hi">{t.value}</span>
                </div>
                <div className="h-2 rounded-full bg-base-surface2 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: t.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(t.value / maxType) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="card p-6 lg:col-span-2">
          <h2 className="font-display font-semibold text-ink-hi mb-6">Review score by repository</h2>
          <div className="flex flex-col gap-4">
            {repos.map((r, i) => (
              <div key={r.id} className="flex items-center gap-4">
                <span className="text-sm text-ink-mid font-mono w-44 truncate">{r.fullName}</span>
                <div className="flex-1 h-2.5 rounded-full bg-base-surface2 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-blue to-violet"
                    initial={{ width: 0 }}
                    animate={{ width: `${r.score}%` }}
                    transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: 'easeOut' }}
                  />
                </div>
                <span className="font-mono text-xs text-ink-hi w-10 text-right">{r.score}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="card p-6 lg:col-span-2">
          <h2 className="font-display font-semibold text-ink-hi mb-6">Fix pipeline status</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Open', value: statusCounts.open, color: '#F5A623' },
              { label: 'Fixed', value: statusCounts.fixed, color: '#7C93FF' },
              { label: 'Validated', value: statusCounts.validated, color: '#33D69F' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-base-border bg-base-surface2/40 py-5">
                <p className="text-2xl font-display font-semibold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-ink-low mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppShell>
  )
}
