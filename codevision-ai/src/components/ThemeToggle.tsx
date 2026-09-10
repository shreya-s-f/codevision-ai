import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative flex items-center justify-center w-9 h-9 rounded-xl border border-base-border bg-base-surface2 text-ink-hi hover:border-ink-mid/60 transition-all duration-300 active:scale-95 shadow-sm ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180, scale: isDark ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="absolute"
      >
        <Moon size={16} className="text-zinc-200" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? -180 : 0, scale: isDark ? 0 : 1 }}
        transition={{ duration: 0.25 }}
        className="absolute"
      >
        <Sun size={16} className="text-zinc-900" />
      </motion.div>
    </button>
  )
}
