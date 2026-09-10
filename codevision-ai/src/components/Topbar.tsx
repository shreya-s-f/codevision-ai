import { Bell, Search, Menu, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../context/AuthContext'

export default function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'CV'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="sticky top-0 z-30 border-b border-base-border bg-base-bg/85 backdrop-blur-md transition-colors duration-200">
      <div className="h-16 px-5 md:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button className="lg:hidden text-ink-mid hover:text-ink-hi" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="font-display font-semibold text-lg leading-tight truncate text-ink-hi">{title}</h1>
            {subtitle && <p className="text-xs text-ink-low truncate">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-base-surface2 border border-base-border rounded-xl px-3 py-2 w-60">
            <Search size={14} className="text-ink-low" />
            <input placeholder="Search repos, findings…" className="bg-transparent text-xs outline-none placeholder:text-ink-low w-full text-ink-hi" />
          </div>

          <ThemeToggle />

          <button className="relative w-9 h-9 rounded-xl bg-base-surface2 border border-base-border flex items-center justify-center text-ink-mid hover:text-ink-hi transition-colors" aria-label="Notifications">
            <Bell size={15} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-signal-green" />
          </button>

          <div className="relative">
            <button
              onClick={() => setUserDropdown(!userDropdown)}
              className="flex items-center gap-2.5 p-1 sm:pr-3 rounded-xl border border-base-border bg-base-surface2 hover:border-sky-400/40 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-ink-hi leading-none">
                  Hello, {user?.full_name ? user.full_name.split(' ')[0] : 'Arjun'}
                </p>
                <p className="text-[10px] text-ink-low leading-tight truncate max-w-[120px] mt-0.5">
                  {user?.email || 'arjun@example.com'}
                </p>
              </div>
            </button>

            {userDropdown && (
              <div className="absolute right-0 mt-2 w-56 card p-2.5 shadow-xl border-base-border z-50 animate-fadeUp">
                <div className="px-3 py-2 border-b border-base-border mb-1">
                  <p className="text-xs font-semibold text-ink-hi truncate">{user?.full_name || 'CodeVision Reviewer'}</p>
                  <p className="text-[11px] text-ink-low truncate">{user?.email || 'reviewer@codevision.ai'}</p>
                  <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-base-surface2 text-ink-mid mt-1">
                    {user?.role || 'Lead Reviewer'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-signal-red hover:bg-signal-red/10 rounded-lg transition-colors text-left"
                >
                  <LogOut size={13} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full animate-fadeUp">
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  )
}
