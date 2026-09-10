import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Search, LayoutDashboard, GitBranch, ShieldCheck, Wrench, History, Settings,
  BarChart3, FileText, Wand2, BookOpen, Home, CornerDownLeft,
} from 'lucide-react'
import { repos, issues } from '../data/mock'

interface Item {
  id: string
  label: string
  hint?: string
  icon: any
  to: string
  group: string
}

const staticItems: Item[] = [
  { id: 'home', label: 'Landing page', icon: Home, to: '/', group: 'Pages' },
  { id: 'dash', label: 'Dashboard', icon: LayoutDashboard, to: '/app', group: 'Pages' },
  { id: 'repos', label: 'Repositories', icon: GitBranch, to: '/app/repositories', group: 'Pages' },
  { id: 'review', label: 'Review Results', icon: ShieldCheck, to: '/app/review', group: 'Pages' },
  { id: 'fixes', label: 'AI Fixes', icon: Wrench, to: '/app/fixes', group: 'Pages' },
  { id: 'insights', label: 'Insights', icon: BarChart3, to: '/app/insights', group: 'Pages' },
  { id: 'analyzer', label: 'Live Code Analyzer', icon: Wand2, to: '/app/analyzer', group: 'Pages' },
  { id: 'reports', label: 'Reports', icon: FileText, to: '/app/reports', group: 'Pages' },
  { id: 'history', label: 'Review History', icon: History, to: '/app/history', group: 'Pages' },
  { id: 'settings', label: 'Settings', icon: Settings, to: '/app/settings', group: 'Pages' },
  { id: 'docs', label: 'How to use CodeVision.ai', icon: BookOpen, to: '/docs', group: 'Pages' },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const navigate = useNavigate()

  const items: Item[] = useMemo(() => {
    const repoItems: Item[] = repos.map((r) => ({
      id: `repo-${r.id}`, label: r.fullName, hint: `${r.openIssues} open issues`, icon: GitBranch, to: '/app/repositories', group: 'Repositories',
    }))
    const issueItems: Item[] = issues.map((i) => ({
      id: `issue-${i.id}`, label: i.title, hint: i.file, icon: ShieldCheck, to: '/app/review', group: 'Findings',
    }))
    return [...staticItems, ...repoItems, ...issueItems]
  }, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return staticItems
    const q = query.toLowerCase()
    return items.filter((i) => i.label.toLowerCase().includes(q) || i.hint?.toLowerCase().includes(q))
  }, [query, items])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (open) { setQuery(''); setActive(0) }
  }, [open])

  useEffect(() => setActive(0), [query])

  const select = (item: Item) => {
    navigate(item.to)
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    if (e.key === 'Enter' && filtered[active]) { e.preventDefault(); select(filtered[active]) }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="relative card w-full max-w-lg overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-base-border">
              <Search size={16} className="text-ink-low shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Jump to a page, repository, or finding…"
                className="bg-transparent outline-none text-sm w-full placeholder:text-ink-low"
              />
              <kbd className="text-[10px] font-mono text-ink-low border border-base-border rounded px-1.5 py-0.5">esc</kbd>
            </div>

            <div className="max-h-80 overflow-y-auto py-2">
              {filtered.length === 0 && (
                <p className="text-sm text-ink-low text-center py-8">No matches for "{query}"</p>
              )}
              {filtered.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => select(item)}
                  onMouseEnter={() => setActive(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    active === i ? 'bg-base-surface2' : ''
                  }`}
                >
                  <item.icon size={15} className="text-blue-glow shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink-hi truncate">{item.label}</p>
                    {item.hint && <p className="text-xs text-ink-low truncate font-mono">{item.hint}</p>}
                  </div>
                  <span className="text-[10px] text-ink-low font-mono shrink-0">{item.group}</span>
                  {active === i && <CornerDownLeft size={12} className="text-ink-low shrink-0" />}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
