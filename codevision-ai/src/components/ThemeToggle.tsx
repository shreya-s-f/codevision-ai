import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative flex items-center p-1 rounded-full border border-base-border bg-base-surface2 hover:border-sky-400/40 transition-all duration-300 active:scale-95 shadow-xs ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      {/* Active background pill slider */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`w-6 h-6 rounded-full flex items-center justify-center ${
          !isDark
            ? 'bg-amber-400 text-slate-900 shadow-sm'
            : 'text-ink-low hover:text-ink-hi'
        }`}
      >
        <Sun size={13} className={!isDark ? 'text-slate-900' : 'text-ink-low'} />
      </motion.div>

      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`w-6 h-6 rounded-full flex items-center justify-center ${
          isDark
            ? 'bg-gradient-to-tr from-sky-400 to-purple-500 text-white shadow-sm'
            : 'text-ink-low hover:text-ink-hi'
        }`}
      >
        <Moon size={13} className={isDark ? 'text-white' : 'text-ink-low'} />
      </motion.div>
    </button>
  )
}
