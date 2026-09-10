import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export default function SectionHeading({
  eyebrow,
  title,
  desc,
  align = 'left',
}: {
  eyebrow: string
  title: ReactNode
  desc?: string
  align?: 'left' | 'center'
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}
    >
      <span className="eyebrow mb-4">
        <span className="w-6 h-px bg-gradient-to-r from-blue-glow to-violet-glow" />
        {eyebrow}
      </span>
      <h2 className="h-display text-3xl md:text-[2.5rem] leading-tight mb-4">{title}</h2>
      {desc && <p className="text-ink-mid text-[15px] leading-relaxed">{desc}</p>}
    </motion.div>
  )
}
