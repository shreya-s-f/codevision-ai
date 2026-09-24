import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, GitBranch, ShieldCheck, Wrench, History, Settings, LogOut,
  Wand2, FileText, BookOpen, Layers
} from 'lucide-react'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

const primaryNav = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/modules', label: 'Modules (22UIS717P)', icon: Layers },
  { to: '/app/analyzer', label: 'Code Review', icon: Wand2 },
  { to: '/app/history', label: 'History', icon: History },
  { to: '/app/repositories', label: 'My Projects', icon: GitBranch },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

const secondaryNav = [
  { to: '/app/review', label: 'Review Results', icon: ShieldCheck },
  { to: '/app/fixes', label: 'AI Fixes', icon: Wrench },
  { to: '/app/reports', label: 'Reports', icon: FileText },
  { to: '/docs', label: 'Documentation', icon: BookOpen },
]

export default function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-base-border bg-base-surface/70 backdrop-blur-md min-h-screen sticky top-0 z-20">
      <div className="h-16 flex items-center px-6 border-b border-base-border">
        <Logo size={28} />
      </div>

      {/* Main Navigation matching Reference Mockup #4 */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-1 overflow-y-auto">
        {primaryNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500/15 via-indigo-500/15 to-purple-500/15 text-sky-400 border border-sky-400/30 shadow-[0_0_15px_rgba(56,189,248,0.15)] font-semibold'
                  : 'text-ink-mid hover:text-ink-hi hover:bg-base-surface2 border border-transparent'
              }`
            }
          >
            <item.icon size={17} className="shrink-0" />
            {item.label}
          </NavLink>
        ))}

        {/* Existing Modules / Advanced Tools */}
        <div className="pt-4 mt-2 border-t border-base-border/70">
          <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-ink-low block mb-1">
            Workspace Tools
          </span>
          {secondaryNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-base-surface2 text-sky-400 font-semibold'
                    : 'text-ink-low hover:text-ink-hi hover:bg-base-surface2 border border-transparent'
                }`
              }
            >
              <item.icon size={15} className="shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom Logout Button */}
      <div className="px-3 py-4 border-t border-base-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-ink-mid hover:text-red-400 hover:bg-red-500/10 transition-colors text-left"
        >
          <LogOut size={17} /> Logout
        </button>
      </div>
    </aside>
  )
}
