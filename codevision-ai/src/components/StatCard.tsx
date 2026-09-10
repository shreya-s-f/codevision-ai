import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

export default function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = 'blue',
  delay = 0,
}: {
  label: string
  value: string
  delta?: string
  icon: LucideIcon
  tone?: 'blue' | 'violet' | 'green' | 'amber'
  delay?: number
}) {
  const toneMap: Record<string, string> = {
    blue: 'from-blue/20 to-blue/5 text-blue-glow',
    violet: 'from-violet/20 to-violet/5 text-violet-glow',
    green: 'from-signal-green/20 to-signal-green/5 text-signal-green',
    amber: 'from-signal-amber/20 to-signal-amber/5 text-signal-amber',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="card card-hover p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-ink-low mb-2">{label}</p>
          <p className="text-2xl font-display font-semibold text-ink-hi">{value}</p>
          {delta && <p className="text-xs text-signal-green mt-1.5">{delta}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${toneMap[tone]} flex items-center justify-center`}>
          <Icon size={18} />
        </div>
      </div>
    </motion.div>
  )
}
