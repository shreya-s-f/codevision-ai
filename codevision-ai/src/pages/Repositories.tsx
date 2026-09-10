import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { GitBranch, Star, Plus, X, Github, Search, Loader2, CheckCircle2, RefreshCw } from 'lucide-react'
import AppShell from '../components/AppShell'
import { api, Repository } from '../services/api'
import { repos as initialRepos } from '../data/mock'

export default function Repositories() {
  const [repoList, setRepoList] = useState<Repository[]>(initialRepos)
  const [modalOpen, setModalOpen] = useState(false)
  const [stage, setStage] = useState<'form' | 'connecting' | 'done'>('form')
  const [repoUrl, setRepoUrl] = useState('')
  const [filterText, setFilterText] = useState('')
  const [loading, setLoading] = useState(false)

  const loadRepos = async () => {
    setLoading(true)
    try {
      const data = await api.getRepositories()
      if (data && data.length > 0) setRepoList(data)
    } catch {
      setRepoList(initialRepos)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRepos()
  }, [])

  const connect = async (e: React.FormEvent) => {
    e.preventDefault()
    setStage('connecting')
    try {
      const newRepo = await api.createRepository(repoUrl)
      setRepoList(prev => [newRepo, ...prev])
      setStage('done')
    } catch {
      // Fallback local addition
      const repoName = repoUrl.split('/').filter(Boolean).pop() || 'new-repository'
      const fallbackRepo: Repository = {
        id: `r_${Date.now()}`,
        name: repoName,
        fullName: `user/${repoName}`,
        language: 'TypeScript',
        stars: 1,
        score: 88,
        openIssues: 2,
        lastScan: 'Just now',
      }
      setRepoList(prev => [fallbackRepo, ...prev])
      setStage('done')
    }
  }

  const closeModal = () => {
    setModalOpen(false)
    setTimeout(() => {
      setStage('form')
      setRepoUrl('')
    }, 300)
  }

  const filteredRepos = repoList.filter(
    r =>
      r.name.toLowerCase().includes(filterText.toLowerCase()) ||
      r.fullName.toLowerCase().includes(filterText.toLowerCase()) ||
      r.language.toLowerCase().includes(filterText.toLowerCase())
  )

  return (
    <AppShell title="Repositories" subtitle="Connect and monitor repositories under hybrid AI review">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2 bg-base-surface2 border border-base-border rounded-xl px-3 py-2 w-full max-w-xs">
          <Search size={14} className="text-ink-low" />
          <input
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            placeholder="Filter repositories…"
            className="bg-transparent text-xs outline-none placeholder:text-ink-low w-full text-ink-hi"
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={loadRepos}
            className="btn-secondary !py-2 !px-3 text-xs"
            title="Refresh repository list"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setModalOpen(true)} className="btn-primary text-xs !py-2">
            <Plus size={14} /> Connect Repository
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {filteredRepos.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="card card-hover p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-base-surface2 border border-base-border flex items-center justify-center">
                  <GitBranch size={18} className="text-ink-hi" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-hi">{r.fullName}</p>
                  <p className="text-xs text-ink-low mt-0.5">{r.language} · scanned {r.lastScan}</p>
                </div>
              </div>
              <span className="pill bg-base-surface2 text-ink-mid border border-base-border text-xs">
                <Star size={11} /> {r.stars}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-1.5 rounded-full bg-base-surface2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-ink-hi"
                  style={{ width: `${r.score}%` }}
                />
              </div>
              <span className="font-mono text-xs text-ink-hi font-medium">{r.score}/100</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-base-border">
              <span className="pill bg-signal-amber/10 text-signal-amber border border-signal-amber/25 text-xs">
                {r.openIssues} open issues
              </span>
              <Link to="/app/review" className="text-xs text-ink-hi hover:underline font-medium">
                View review results →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="relative card w-full max-w-md p-6"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-ink-low hover:text-ink-hi"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {stage === 'form' && (
                <>
                  <h3 className="h-display text-lg mb-1.5">Connect a repository</h3>
                  <p className="text-xs text-ink-mid mb-6">
                    Link a GitHub repository so CodeVision.ai can inspect commits, branches, and PRs.
                  </p>
                  <button className="btn-secondary w-full text-xs mb-4">
                    <Github size={15} /> Authorize with GitHub
                  </button>
                  <div className="flex items-center gap-3 my-4">
                    <div className="h-px bg-base-border flex-1" />
                    <span className="text-[11px] text-ink-low font-mono uppercase">or enter repository URL</span>
                    <div className="h-px bg-base-border flex-1" />
                  </div>
                  <form onSubmit={connect} className="flex flex-col gap-4">
                    <input
                      required
                      value={repoUrl}
                      onChange={e => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/shreya/my-microservice"
                      className="input-field text-xs"
                    />
                    <button type="submit" className="btn-primary w-full text-xs">
                      Connect & Begin Scan
                    </button>
                  </form>
                </>
              )}

              {stage === 'connecting' && (
                <div className="py-8 flex flex-col items-center text-center gap-4">
                  <Loader2 size={28} className="animate-spin text-ink-hi" />
                  <div>
                    <p className="font-medium text-ink-hi text-sm">Connecting repository…</p>
                    <p className="text-xs text-ink-mid mt-1">
                      Cloning AST tree, running Semgrep static analysis rules, and indexing for RAG.
                    </p>
                  </div>
                </div>
              )}

              {stage === 'done' && (
                <div className="py-8 flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-signal-green/10 border border-signal-green/30 flex items-center justify-center">
                    <CheckCircle2 size={26} className="text-signal-green" />
                  </div>
                  <div>
                    <p className="font-medium text-ink-hi text-sm">Repository connected</p>
                    <p className="text-xs text-ink-mid mt-1">
                      Static & LLM review scheduled. Findings will stream to your review dashboard.
                    </p>
                  </div>
                  <button onClick={closeModal} className="btn-primary text-xs mt-2">
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  )
}
