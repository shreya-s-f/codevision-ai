import Logo from './Logo'
import { Github, Linkedin, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-base-border mt-32">
      <div className="container-xl py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="text-sm text-ink-low max-w-xs">
            An AI-powered automated code review platform that analyzes repositories, identifies security vulnerabilities, and generates instant actionable code fixes.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/shreya-s-f/codevision-ai" target="_blank" rel="noreferrer" className="text-ink-low hover:text-ink-hi transition-colors" aria-label="GitHub"><Github size={18} /></a>
          <a href="#" className="text-ink-low hover:text-ink-hi transition-colors" aria-label="LinkedIn"><Linkedin size={18} /></a>
          <a href="#" className="text-ink-low hover:text-ink-hi transition-colors" aria-label="Twitter"><Twitter size={18} /></a>
        </div>
      </div>
      <div className="border-t border-base-border">
        <div className="container-xl py-5 text-xs text-ink-low flex flex-col sm:flex-row gap-2 sm:justify-between">
          <span>© 2026 CodeVision.ai. All rights reserved.</span>
          <span>Next-Generation Intelligent Code Review & Quality Assurance</span>
        </div>
      </div>
    </footer>
  )
}
