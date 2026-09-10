import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Rocket, GitBranch, ShieldCheck, Wrench, FlaskConical, BarChart3, Wand2,
  FileText, Command, HelpCircle, ArrowRight,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const sections = [
  { id: 'getting-started', label: 'Getting started', icon: Rocket },
  { id: 'connect-repo', label: 'Connecting a repository', icon: GitBranch },
  { id: 'review-results', label: 'Reading review results', icon: ShieldCheck },
  { id: 'ai-fixes', label: 'AI-assisted fixes', icon: Wrench },
  { id: 'validation', label: 'Validating a fix', icon: FlaskConical },
  { id: 'insights', label: 'Insights & reports', icon: BarChart3 },
  { id: 'analyzer', label: 'Live code analyzer', icon: Wand2 },
  { id: 'shortcuts', label: 'Command palette', icon: Command },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
]

export default function Docs() {
  const [activeId, setActiveId] = useState('getting-started')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="overflow-x-hidden">
      <Navbar />

      <section className="relative pt-16 pb-10">
        <div className="absolute inset-0 bg-grid-fade pointer-events-none" />
        <div className="container-xl relative">
          <span className="eyebrow mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-glow animate-pulseGlow" /> Documentation
          </span>
          <h1 className="h-display text-3xl md:text-4xl mb-3">How to use CodeVision.ai</h1>
          <p className="text-ink-mid max-w-xl">
            A walkthrough of every screen — from connecting your first repository to downloading a validated fix report.
          </p>
        </div>
      </section>

      <div className="container-xl grid lg:grid-cols-[220px_1fr] gap-10 pb-28">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 flex flex-col gap-1">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeId === s.id ? 'text-ink-hi bg-base-surface2 border border-base-border' : 'text-ink-mid hover:text-ink-hi'
                }`}
              >
                <s.icon size={14} /> {s.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="flex flex-col gap-16 min-w-0">
          <DocSection id="getting-started" icon={Rocket} title="Getting started">
            <p>
              Create an account from the <Link to="/signup" className="text-blue-glow hover:underline">sign-up page</Link> or continue with GitHub.
              Once you're in, you'll land on the <strong className="text-ink-hi">Dashboard</strong> — an overview of every connected
              repository, its open issues, and its current review score.
            </p>
            <ol className="list-decimal list-inside flex flex-col gap-2 mt-4 text-ink-mid">
              <li>Sign up or log in.</li>
              <li>Connect a repository from the Dashboard or the Repositories page.</li>
              <li>Open Review Results once the first scan finishes.</li>
              <li>Generate and validate fixes for anything you want resolved.</li>
            </ol>
          </DocSection>

          <DocSection id="connect-repo" icon={GitBranch} title="Connecting a repository">
            <p>
              Go to <strong className="text-ink-hi">Repositories → Connect repository</strong>. You can authorize with GitHub directly,
              or paste a repository URL. CodeVision.ai reads the repository structure and indexes files so the AI review step has
              real context to work from (this is the RAG — Retrieval-Augmented Generation — step from the architecture).
            </p>
            <p className="mt-3">Once connected, the first scan is queued automatically and appears on your Dashboard within a few minutes.</p>
          </DocSection>

          <DocSection id="review-results" icon={ShieldCheck} title="Reading review results">
            <p>
              The <strong className="text-ink-hi">Review Results</strong> page lists every finding from a pull request, combining
              static analysis, security scanning, and AI reasoning. Each card shows:
            </p>
            <ul className="list-disc list-inside flex flex-col gap-2 mt-4 text-ink-mid">
              <li><strong className="text-ink-hi">Severity</strong> — critical, high, medium, or low.</li>
              <li><strong className="text-ink-hi">Type</strong> — bug, security, performance, or code quality.</li>
              <li><strong className="text-ink-hi">Explanation</strong> — a plain-language description of the risk.</li>
              <li><strong className="text-ink-hi">Suggestion</strong> — what the AI recommends changing and why.</li>
            </ul>
            <p className="mt-3">Use the filter pills at the top to narrow the list down to one category at a time.</p>
          </DocSection>

          <DocSection id="ai-fixes" icon={Wrench} title="AI-assisted fixes">
            <p>
              Expand any finding and click <strong className="text-ink-hi">Generate AI fix</strong>. CodeVision.ai proposes a concrete
              code change and shows it as a before/after diff, so you can review exactly what would change before accepting anything —
              the developer always has the final decision.
            </p>
          </DocSection>

          <DocSection id="validation" icon={FlaskConical} title="Validating a fix">
            <p>
              After a fix is generated, click <strong className="text-ink-hi">Run validation</strong>. This applies the change in an
              isolated sandbox, re-runs tests, and re-scans the code with the same static and security analysis. Once both checks pass,
              you can attach the validated change to the pull request.
            </p>
          </DocSection>

          <DocSection id="insights" icon={BarChart3} title="Insights & reports">
            <p>
              The <strong className="text-ink-hi">Insights</strong> page charts findings by severity and category, and compares review
              scores across repositories, so you can see where review debt is concentrated.
            </p>
            <p className="mt-3">
              The <strong className="text-ink-hi">Reports</strong> page lets you pick a repository and download a Markdown summary of
              its findings and suggested fixes — useful for sharing a review outside the app.
            </p>
          </DocSection>

          <DocSection id="analyzer" icon={Wand2} title="Live code analyzer">
            <p>
              Want to see the review logic work on your own snippet right now? Open <strong className="text-ink-hi">Live Code
              Analyzer</strong>, paste any Python, JavaScript, or TypeScript code, and click Analyze. It runs the same category of
              pattern checks CodeVision.ai's static-analysis layer uses — entirely in your browser — and lists what it finds with
              severity and a suggested fix.
            </p>
          </DocSection>

          <DocSection id="shortcuts" icon={Command} title="Command palette">
            <p>
              Press <kbd className="px-1.5 py-0.5 rounded bg-base-surface2 border border-base-border text-xs font-mono">Ctrl</kbd> +{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-base-surface2 border border-base-border text-xs font-mono">K</kbd> (or{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-base-surface2 border border-base-border text-xs font-mono">⌘</kbd> +{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-base-surface2 border border-base-border text-xs font-mono">K</kbd> on Mac)
              anywhere in the app to open the command palette. Search across pages, repositories, and findings, then press Enter
              to jump straight there.
            </p>
          </DocSection>

          <DocSection id="faq" icon={HelpCircle} title="FAQ">
            <div className="flex flex-col gap-5">
              <FaqItem q="Does this connect to a real backend?" a="This build is the frontend only, wired to realistic mock data in src/data/mock.ts. Every interaction — connecting a repo, generating a fix, validating it, exporting a report — is fully functional in the UI and ready to be pointed at the FastAPI backend described in the project report." />
              <FaqItem q="Where does the Live Code Analyzer's logic live?" a="In src/lib/analyzeCode.ts — a small set of pattern-matching rules that run in the browser, so you can extend it with your own checks." />
              <FaqItem q="Can I use this on mobile?" a="Yes — every page is responsive, and the sidebar collapses into a mobile menu below the lg breakpoint." />
            </div>
          </DocSection>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
          >
            <div>
              <h3 className="font-display font-semibold text-lg text-ink-hi mb-1">Ready to try it on your own repo?</h3>
              <p className="text-sm text-ink-mid">Connect a repository and see static, security, and AI review run together.</p>
            </div>
            <Link to="/app/repositories" className="btn-primary text-sm shrink-0">
              Connect a repository <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function DocSection({ id, icon: Icon, title, children }: { id: string; icon: any; title: string; children: React.ReactNode }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className="scroll-mt-24"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue/20 to-violet/10 flex items-center justify-center">
          <Icon size={15} className="text-blue-glow" />
        </div>
        <h2 className="font-display font-semibold text-xl text-ink-hi">{title}</h2>
      </div>
      <div className="text-[15px] text-ink-mid leading-relaxed">{children}</div>
    </motion.section>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="border-l-2 border-blue/30 pl-4">
      <p className="text-ink-hi font-medium mb-1.5">{q}</p>
      <p className="text-sm text-ink-mid leading-relaxed">{a}</p>
    </div>
  )
}
