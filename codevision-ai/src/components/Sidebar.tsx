import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, GitBranch, ShieldCheck, Wrench, History, Settings, LogOut,
  BarChart3, Wand2, FileText, BookOpen,
} from 'lucide-react'
import Logo from './Logo'

const nav = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/analyzer', label: 'Code Review', icon: Wand2 },
  { to: '/app/history', label: 'History', icon: History },
  { to: '/app/repositories', label: 'My Projects', icon: GitBranch },
  { to: '/app/review', label: 'Review Results', icon: ShieldCheck },
  { to: '/app/fixes', label: 'AI Fixes', icon: Wrench },
  { to: '/app/reports', label: 'Reports', icon: FileText },
  { to: '/docs', label: 'Documentation', icon: BookOpen },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-base-border bg-base-surface/60 backdrop-blur-sm min-h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-base-border">
        <Logo />
      </div>

      <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue/15 to-violet/15 text-ink-hi border border-blue/25'
                  : 'text-ink-mid hover:text-ink-hi hover:bg-base-surface2 border border-transparent'
              }`
            }
          >
            <item.icon size={17} className="shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-base-border flex flex-col gap-1">
        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive ? 'text-ink-hi bg-base-surface2' : 'text-ink-mid hover:text-ink-hi hover:bg-base-surface2'
            }`
          }
        >
          <Settings size={17} /> Settings
        </NavLink>
        <NavLink to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-mid hover:text-signal-red transition-colors">
          <LogOut size={17} /> Sign out
        </NavLink>
      </div>
    </aside>
  )
}
