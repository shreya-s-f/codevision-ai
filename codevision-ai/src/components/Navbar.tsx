import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, ArrowRight } from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../context/AuthContext'

const links = [
  { label: 'Home', href: '#hero' },
  { label: 'Modules (22UIS717P)', href: '/modules' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#workflow' },
  { label: 'About', href: '#about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-base-bg/85 backdrop-blur-md border-b border-base-border shadow-xs'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container-xl flex items-center justify-between h-16">
        <Link to="/"><Logo /></Link>

        {/* Center links matching reference image */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-base font-semibold text-ink-mid hover:text-sky-400 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right side controls matching reference */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link to="/app" className="btn-primary text-sm !py-2.5 !px-5 rounded-full font-semibold">
              Dashboard <ArrowRight size={15} />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-base font-semibold text-ink-hi hover:text-sky-400 transition-colors px-2"
              >
                Login
              </Link>
              <button
                onClick={() => navigate('/signup')}
                className="btn-primary text-sm !py-2.5 !px-5 rounded-full font-semibold"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button className="text-ink-hi p-1.5" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden container-xl pb-6 flex flex-col gap-4 animate-fadeUp bg-base-surface border-b border-base-border">
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-sm text-ink-mid hover:text-sky-400 py-1">
              {l.label}
            </a>
          ))}
          <div className="flex flex-col gap-2.5 pt-2">
            <Link to="/login" className="btn-secondary text-sm justify-center">Login</Link>
            <Link to="/signup" className="btn-primary text-sm justify-center">Get Started</Link>
          </div>
        </div>
      )}
    </header>
  )
}
