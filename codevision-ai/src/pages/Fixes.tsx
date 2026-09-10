import { motion } from 'framer-motion'
import { Sparkles, FlaskConical, GitPullRequest } from 'lucide-react'
import AppShell from '../components/AppShell'
import IssueCard from '../components/IssueCard'
import { issues } from '../data/mock'

const steps = [
  { icon: Sparkles, title: 'Fix generation', desc: 'Repository context and the issue description are used to draft a targeted code change.' },
  { icon: FlaskConical, title: 'Sandbox validation', desc: 'The fix is applied in an isolated environment, tests run, and the code is re-scanned.' },
  { icon: GitPullRequest, title: 'Pull request update', desc: 'Once validated, the change and its explanation are ready to attach to the pull request.' },
]

export default function Fixes() {
  return (
    <AppShell title="AI-Assisted Fixes" subtitle="Generate, review, and validate suggested code changes">
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="card p-5 flex gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue/20 to-violet/10 flex items-center justify-center shrink-0">
              <s.icon size={17} className="text-blue-glow" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink-hi mb-1">{s.title}</p>
              <p className="text-xs text-ink-mid leading-relaxed">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {issues.map((issue, i) => (
          <motion.div
            key={issue.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
          >
            <IssueCard issue={issue} defaultOpen={issue.status !== 'open'} />
          </motion.div>
        ))}
      </div>
    </AppShell>
  )
}
