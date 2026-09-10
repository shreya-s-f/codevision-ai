import Logo from './Logo'
import { Github, Linkedin, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-base-border mt-32">
      <div className="container-xl py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="text-sm text-ink-low max-w-xs">
            An AI-powered code review assistant for repositories and pull requests — built as a major project at Basaveshwar Engineering College, Bagalkote.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-ink-low hover:text-ink-hi transition-colors" aria-label="GitHub"><Github size={18} /></a>
          <a href="#" className="text-ink-low hover:text-ink-hi transition-colors" aria-label="LinkedIn"><Linkedin size={18} /></a>
          <a href="#" className="text-ink-low hover:text-ink-hi transition-colors" aria-label="Twitter"><Twitter size={18} /></a>
        </div>
      </div>
      <div className="border-t border-base-border">
        <div className="container-xl py-5 text-xs text-ink-low flex flex-col sm:flex-row gap-2 sm:justify-between">
          <span>© 2026 CodeVision.ai — Department of Information Science and Engineering</span>
          <span>Demo-1 · Major Project 22UIS717P</span>
        </div>
      </div>
    </footer>
  )
}
