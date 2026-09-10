import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  GitBranch, ShieldAlert, Bug, Gauge, ArrowRight, Star, Plus, RefreshCw,
  FileCode, Sparkles, CheckCircle2, AlertCircle, Lightbulb, FolderGit2,
  Clock, ShieldCheck, ChevronRight, Wand2
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

const recentActivities: ActivityItem[] = [
  {
    id: 'act-1',
    file: 'python_script.py',
    language: 'Python',
    issuesCount: 2,
    status: 'issues',
    time: '10 mins ago',
    link: '/app/analyzer',
  },
  {
    id: 'act-2',
    file: 'web_app.js',
    language: 'JavaScript',
    issuesCount: 0,
    status: 'clean',
    time: '1 hour ago',
    link: '/app/review',
  },
  {
    id: 'act-3',
    file: 'data_processing.py',
    language: 'Python',
    issuesCount: 1,
    status: 'issues',
    time: '3 hours ago',
    link: '/app/analyzer',
  },
  {
    id: 'act-4',
    file: 'auth_service.ts',
    language: 'TypeScript',
    issuesCount: 2,
    status: 'issues',
    time: 'Yesterday',
    link: '/app/analyzer',
  },
]

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    connected_repositories: 4,
    open_issues: 8,
    critical_findings: 3,
    average_score: '88/100',
  })
  const [repoList, setRepoList] = useState<Repository[]>(mockRepos)
  const [findings, setFindings] = useState<ReviewItem[]>(mockIssues)
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [s, r, f] = await Promise.all([
        api.getStats().catch(() => null),
        api.getRepositories().catch(() => null),
        api.getReviews().catch(() => null),
      ])
      if (s) setStats(s)
      if (r && r.length > 0) setRepoList(r)
      if (f && f.length > 0) setFindings(f)
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
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Reviews"
          value="12"
          delta="+2 this week"
          icon={FileCode}
          tone="blue"
          delay={0}
        />
        <StatCard
          label="Issues Found"
          value={String(stats.open_issues || 8)}
          delta={`${stats.critical_findings || 3} High • 5 Low`}
          icon={Bug}
          tone="amber"
          delay={0.05}
        />
        <StatCard
          label="Suggestions"
          value="10"
          delta="7 Applied"
          icon={Lightbulb}
          tone="violet"
          delay={0.1}
        />
        <StatCard
          label="Projects"
          value={String(stats.connected_repositories || 4)}
          delta="All active"
          icon={FolderGit2}
          tone="green"
          delay={0.15}
        />
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
                        {act.file}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-ink-low mt-0.5">
                        <span>{act.language}</span>
                        <span>•</span>
                        {act.status === 'clean' ? (
                          <span className="text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle2 size={12} /> Clean (0 issues)
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
            <span className="text-xs text-ink-low">Showing 4 most recent runs</span>
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
            {/* 3D Glowing Tech Icon Graphic */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-400/20 to-purple-400/20 border border-sky-400/40 flex items-center justify-center mb-4 shadow-lg shadow-sky-500/10 relative">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 to-purple-400 flex items-center justify-center text-white shadow-md">
                <Sparkles size={18} />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500" />
              </span>
            </div>

            <h2 className="font-display font-bold text-xl text-ink-hi mb-2">
              Keep Improving
            </h2>
            <p className="text-xs sm:text-sm text-ink-mid leading-relaxed mb-6">
              Analyze your code regularly to catch issues early and maintain clean, safe code.
            </p>

            {/* Quick benefit bullet points */}
            <div className="space-y-2.5 mb-6">
              <div className="flex items-center gap-2.5 text-xs text-ink-hi">
                <div className="w-5 h-5 rounded-full bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 font-bold shrink-0">
                  ✓
                </div>
                <span>Catch vulnerabilities before deployment</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-ink-hi">
                <div className="w-5 h-5 rounded-full bg-purple-500/15 border border-purple-400/30 flex items-center justify-center text-purple-400 font-bold shrink-0">
                  ✓
                </div>
                <span>Understand issues in simple plain English</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-ink-hi">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                  ✓
                </div>
                <span>Apply AI-generated fixes in 1 click</span>
              </div>
            </div>
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
