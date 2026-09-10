import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { motion } from 'framer-motion'

export default function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-base-bg">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Topbar title={title} subtitle={subtitle} />
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="px-5 md:px-8 py-8 max-w-[1400px]"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
