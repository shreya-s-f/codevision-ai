import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  GitBranch, ShieldAlert, Bug, ArrowRight, Star, Plus, RefreshCw,
  FileCode, Sparkles, CheckCircle2, AlertCircle, Lightbulb, FolderGit2,
  Clock, ChevronRight, Wand2
} from 'lucide-react'
import AppShell from '../components/AppShell'
import StatCard from '../components/StatCard'
import { api, DashboardStats, Repository, ReviewItem } from '../services/api'
import { repos as mockRepos, issues as mockIssues } from '../data/mock'

interface ActivityItem {
  id: string
  file: string
  language: string
  issuesCount: number
  status: 'clean' | 'issues'
  time: string
  link: string
}

const fallbackActivities: ActivityItem[] = [
  {
    id: 'act-1',
    file: 'python_script.py',
    language: 'Python',
    issuesCount: 2,
    status: 'issues',
    time: '2 hours ago',
    link: '/app/analyzer',
  },
  {
    id: 'act-2',
    file: 'web_app.js',
    language: 'JavaScript',
    issuesCount: 0,
    status: 'clean',
    time: '5 hours ago',
    link: '/app/review',
  },
  {
    id: 'act-3',
    file: 'data_processing.py',
    language: 'Python',
    issuesCount: 3,
    status: 'issues',
    time: '1 day ago',
    link: '/app/analyzer',
  },
]

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    total_reviews: 12,
    issues_found: 8,
    suggestions: 10,
    projects: 4,
    connected_repositories: 4,
    open_issues: 8,
    critical_findings: 3,
    average_score: '88/100',
  })
  const [repoList, setRepoList] = useState<Repository[]>(mockRepos)
  const [findings, setFindings] = useState<ReviewItem[]>(mockIssues)
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>(fallbackActivities)
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [s, r, f, h] = await Promise.all([
        api.getStats().catch(() => null),
        api.getRepositories().catch(() => null),
        api.getReviews().catch(() => null),
        api.getHistory().catch(() => null),
      ])
      if (s) setStats(s)
      if (r && r.length > 0) setRepoList(r)
      if (f && f.length > 0) setFindings(f)
      if (h && h.length > 0) {
        setRecentActivities(
          h.slice(0, 4).map((item, idx) => ({
            id: String(item.id || idx),
            file: item.title,
            language: item.language || 'Python',
            issuesCount: item.findings_count,
            status: item.findings_count === 0 ? 'clean' : 'issues',
            time: item.created_at || 'Recently',
            link: '/app/analyzer',
          }))
        )
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openIssues = findings.filter((i) => i.status === 'open')

  return (
    <AppShell
      title="Welcome Back!"
      subtitle="Let's write better code together."
    >
      {/* Top action header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-mono text-ink-low uppercase tracking-wider">
            System Overview & Metrics
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchData}
            disabled={loading}
            className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Refreshing…' : 'Sync Metrics'}
          </button>
          <Link
            to="/app/analyzer"
            className="btn-primary !py-1.5 !px-3.5 text-xs flex items-center gap-1.5 font-semibold"
          >
            <Wand2 size={13} />
            Start Review
          </Link>
        </div>
      </div>

      {/* 4 STAT CARDS FROM MOCKUP #4 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Reviews */}
        <div className="card p-5 border-sky-500/20 bg-base-surface/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-display font-bold text-ink-hi leading-tight">
              {stats.total_reviews ?? 12}
            </p>
            <p className="text-xs text-ink-low mt-0.5 font-medium">Total Reviews</p>
          </div>
        </div>

        {/* Issues Found */}
        <div className="card p-5 border-red-500/20 bg-base-surface/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-400/30 flex items-center justify-center text-red-400 shrink-0">
            <Bug size={20} />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-display font-bold text-ink-hi leading-tight">
              {stats.issues_found ?? stats.open_issues ?? 8}
            </p>
            <p className="text-xs text-ink-low mt-0.5 font-medium">Issues Found</p>
          </div>
        </div>

        {/* Suggestions */}
        <div className="card p-5 border-purple-500/20 bg-base-surface/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-400 shrink-0">
            <Lightbulb size={20} />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-display font-bold text-ink-hi leading-tight">
              {stats.suggestions ?? 10}
            </p>
            <p className="text-xs text-ink-low mt-0.5 font-medium">Suggestions</p>
          </div>
        </div>

        {/* Projects */}
        <div className="card p-5 border-indigo-500/20 bg-base-surface/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shrink-0">
            <FolderGit2 size={20} />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-display font-bold text-ink-hi leading-tight">
              {stats.projects ?? stats.connected_repositories ?? 4}
            </p>
            <p className="text-xs text-ink-low mt-0.5 font-medium">Projects</p>
          </div>
        </div>
      </div>

      {/* 2-COLUMN SECTION FROM MOCKUP #4: RECENT ACTIVITY & KEEP IMPROVING */}
      <div className="grid lg:grid-cols-12 gap-6 mb-8">
        {/* LEFT: RECENT ACTIVITY (60% width) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-7 card p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display font-semibold text-ink-hi text-base flex items-center gap-2">
                  <Clock size={16} className="text-sky-400" />
                  Recent Activity
                </h2>
                <p className="text-xs text-ink-low mt-0.5">
                  Latest code reviews and analyses across your workspace
                </p>
              </div>
              <Link
                to="/app/history"
                className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>

            {/* List of recent activities */}
            <div className="flex flex-col divide-y divide-base-border">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0 hover:bg-base-surface2/40 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-base-surface2 border border-base-border flex items-center justify-center shrink-0">
                      <FileCode size={16} className="text-sky-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-hi truncate font-mono">
                        Analyzed {act.file}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-ink-low mt-0.5">
                        <span>{act.language}</span>
                        <span>•</span>
                        {act.status === 'clean' ? (
                          <span className="text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle2 size={12} /> No issues found
                          </span>
                        ) : (
                          <span className="text-amber-400 font-medium flex items-center gap-1">
                            <AlertCircle size={12} /> {act.issuesCount} issues found
                          </span>
                        )}
                        <span>•</span>
                        <span>{act.time}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={act.link}
                    className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg border border-base-border bg-base-surface hover:border-sky-400/40 text-ink-hi transition-all flex items-center gap-1"
                  >
                    Review <ChevronRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-base-border flex items-center justify-between">
            <span className="text-xs text-ink-low">Showing latest runs</span>
            <Link
              to="/app/history"
              className="text-xs text-sky-400 hover:text-sky-300 font-medium"
            >
              Full History Archive →
            </Link>
          </div>
        </motion.div>

        {/* RIGHT: KEEP IMPROVING CARD FROM MOCKUP #4 (40% width) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="lg:col-span-5 card p-6 relative overflow-hidden flex flex-col justify-between border-sky-400/30 bg-gradient-to-br from-base-surface via-base-surface to-sky-950/20 shadow-glow-subtle"
        >
          {/* Ambient glow accent */}
          <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-sky-500/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />

          <div>
            {/* 3D Isometric Server/Cube Graphic from Mockup #4 */}
            <div className="w-full flex items-center justify-center py-4 relative">
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Glowing neon halo */}
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-400 to-purple-500 rounded-3xl opacity-25 blur-xl animate-pulse" />
                
                {/* 3D Isometric Server/Cube Illustration */}
                <svg viewBox="0 0 120 120" className="w-24 h-24 drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                  <defs>
                    <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7dd3fc" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                    <linearGradient id="cubeLeft" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0284c7" />
                      <stop offset="100%" stopColor="#1e1b4b" />
                    </linearGradient>
                    <linearGradient id="cubeRight" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#7e22ce" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                  </defs>
                  {/* Isometric cube faces */}
                  <polygon points="60,20 95,40 60,60 25,40" fill="url(#cubeTop)" />
                  <polygon points="25,40 60,60 60,100 25,80" fill="url(#cubeLeft)" />
                  <polygon points="60,60 95,40 95,80 60,100" fill="url(#cubeRight)" />
                  
                  {/* Glowing neon circuitry lines */}
                  <line x1="60" y1="60" x2="60" y2="100" stroke="#38bdf8" strokeWidth="1.5" opacity="0.8" />
                  <line x1="35" y1="52" x2="50" y2="60" stroke="#38bdf8" strokeWidth="1.5" opacity="0.8" />
                  <line x1="85" y1="52" x2="70" y2="60" stroke="#c084fc" strokeWidth="1.5" opacity="0.8" />
                  <circle cx="60" cy="40" r="4" fill="#ffffff" />
                  <circle cx="42" cy="72" r="2.5" fill="#38bdf8" />
                  <circle cx="78" cy="72" r="2.5" fill="#c084fc" />
                </svg>
              </div>
            </div>

            <h2 className="font-display font-bold text-2xl text-ink-hi mb-1 text-center">
              Keep Improving
            </h2>
            <p className="text-xs sm:text-sm text-ink-mid leading-relaxed mb-6 text-center font-medium">
              Clean code. Better solutions. Brighter tomorrow.
            </p>
          </div>

          <Link
            to="/app/analyzer"
            className="btn-primary w-full text-center justify-center py-3 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-sky-500/20 hover:scale-[1.01] transition-transform"
          >
            Start a New Review <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>

      {/* CONNECTED REPOSITORIES & HIGHEST PRIORITY FINDINGS */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* ACTIVE REPOSITORIES */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-6 card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-semibold text-ink-hi text-base">Active Projects</h2>
              <p className="text-xs text-ink-low">Connected repositories and monitored codebases</p>
            </div>
            <Link to="/app/repositories" className="text-xs text-ink-hi hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          <div className="flex flex-col divide-y divide-base-border">
            {repoList.map((r) => (
              <div key={r.id} className="py-3.5 flex items-center gap-3.5 first:pt-0 last:pb-0">
                <div className="w-9 h-9 rounded-xl bg-base-surface2 border border-base-border flex items-center justify-center shrink-0">
                  <GitBranch size={15} className="text-ink-hi" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink-hi truncate">{r.fullName}</p>
                  <p className="text-xs text-ink-low mt-0.5">{r.language} · scanned {r.lastScan}</p>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-xs text-ink-low">
                  <Star size={12} /> {r.stars}
                </div>
                <span className="pill bg-amber-500/10 text-amber-400 border border-amber-500/25 text-[11px]">
                  {r.openIssues} open
                </span>
                <span className="font-mono text-xs font-semibold text-ink-hi w-12 text-right">
                  {r.score}/100
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* HIGHEST PRIORITY FINDINGS */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="lg:col-span-6 card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-semibold text-ink-hi text-base">Priority Findings</h2>
              <p className="text-xs text-ink-low">Issues flagged by AI review requiring attention</p>
            </div>
            <Link to="/app/review" className="text-xs text-ink-hi hover:underline flex items-center gap-1">
              Review details <ArrowRight size={12} />
            </Link>
          </div>

          <div className="flex flex-col divide-y divide-base-border">
            {openIssues.slice(0, 4).map((i) => (
              <div key={i.id} className="py-3.5 flex items-center gap-3.5 first:pt-0 last:pb-0">
                <ShieldAlert
                  size={16}
                  className={i.severity === 'critical' ? 'text-red-400 shrink-0' : 'text-amber-400 shrink-0'}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs sm:text-sm font-medium text-ink-hi truncate">{i.title}</p>
                    <span
                      className={`pill text-[10px] uppercase font-mono px-2 py-0.5 border ${
                        i.severity === 'critical'
                          ? 'bg-red-500/10 text-red-400 border-red-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {i.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-low font-mono mt-0.5">{i.file}:{i.line}</p>
                </div>
                <Link to="/app/fixes" className="text-xs text-sky-400 hover:underline shrink-0">
                  View patch →
                </Link>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppShell>
  )
}
