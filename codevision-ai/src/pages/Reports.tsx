import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, CheckCircle2 } from 'lucide-react'
import AppShell from '../components/AppShell'
import { repos, issues, severityMeta } from '../data/mock'

// Local mapping from repo -> issue ids, kept separate from data/mock.ts so the
// existing mock data file doesn't need to change.
const repoIssueMap: Record<string, string[]> = {
  r1: ['i1', 'i2', 'i5', 'i6'],
  r2: ['i3'],
  r3: ['i4', 'i2'],
  r4: ['i6'],
}

function buildMarkdown(repoId: string) {
  const repo = repos.find((r) => r.id === repoId)!
  const repoIssues = issues.filter((i) => repoIssueMap[repoId]?.includes(i.id))
  const date = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })

  const lines: string[] = []
  lines.push(`# CodeVision.ai Review Report`)
  lines.push(``)
  lines.push(`**Repository:** ${repo.fullName}  `)
  lines.push(`**Generated:** ${date}  `)
  lines.push(`**Review score:** ${repo.score}/100  `)
  lines.push(`**Open findings:** ${repoIssues.length}`)
  lines.push(``)
  lines.push(`---`)
  lines.push(``)

  repoIssues.forEach((issue, idx) => {
    lines.push(`## ${idx + 1}. ${issue.title}`)
    lines.push(``)
    lines.push(`- **File:** \`${issue.file}:${issue.line}\``)
    lines.push(`- **Severity:** ${severityMeta[issue.severity].label}`)
    lines.push(`- **Type:** ${issue.type}`)
    lines.push(`- **Status:** ${issue.status}`)
    lines.push(``)
    lines.push(issue.description)
    lines.push(``)
    lines.push(`**Suggested fix:** ${issue.suggestion}`)
    lines.push(``)
    lines.push('```diff')
    issue.before.split('\n').forEach((l) => lines.push(`- ${l}`))
    issue.after.split('\n').forEach((l) => lines.push(`+ ${l}`))
    lines.push('```')
    lines.push(``)
  })

  if (repoIssues.length === 0) {
    lines.push('_No findings recorded for this repository._')
  }

  return lines.join('\n')
}

export default function Reports() {
  const [selected, setSelected] = useState(repos[0].id)
  const [downloaded, setDownloaded] = useState(false)

  const repo = repos.find((r) => r.id === selected)!
  const count = repoIssueMap[selected]?.length ?? 0

  const download = () => {
    const md = buildMarkdown(selected)
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${repo.name}-review-report.md`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2500)
  }

  return (
    <AppShell title="Reports" subtitle="Export a review as a shareable Markdown report">
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card p-6 lg:col-span-1">
          <h2 className="font-display font-semibold text-ink-hi mb-5">Choose a repository</h2>
          <div className="flex flex-col gap-2 mb-6">
            {repos.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelected(r.id)}
                className={`text-left rounded-xl px-4 py-3 border transition-colors ${
                  selected === r.id
                    ? 'border-blue/40 bg-gradient-to-r from-blue/10 to-violet/10 text-ink-hi'
                    : 'border-base-border text-ink-mid hover:text-ink-hi hover:bg-base-surface2/50'
                }`}
              >
                <p className="text-sm font-medium">{r.fullName}</p>
                <p className="text-xs text-ink-low mt-0.5">{repoIssueMap[r.id]?.length ?? 0} findings included</p>
              </button>
            ))}
          </div>

          <button onClick={download} className="btn-primary w-full text-sm justify-center">
            {downloaded ? <CheckCircle2 size={15} /> : <Download size={15} />}
            {downloaded ? 'Downloaded' : 'Download Markdown report'}
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }} className="card p-6 lg:col-span-2">
          <div className="flex items-center gap-2.5 mb-5">
            <FileText size={17} className="text-blue-glow" />
            <h2 className="font-display font-semibold text-ink-hi">Preview — {repo.fullName}</h2>
          </div>
          <pre className="text-[12px] font-mono leading-relaxed text-ink-mid bg-base-surface2/50 border border-base-border rounded-xl p-5 overflow-auto max-h-[520px] whitespace-pre-wrap">
            {buildMarkdown(selected)}
          </pre>
        </motion.div>
      </div>
    </AppShell>
  )
}
