import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const codeSymbols = [
  { symbol: '{ }', top: '20%', left: '15%', delay: 0.1 },
  { symbol: '</>', top: '18%', right: '18%', delay: 0.2 },
  { symbol: '=>', top: '75%', left: '20%', delay: 0.3 },
  { symbol: '( )', top: '72%', right: '22%', delay: 0.25 },
  { symbol: 'const', top: '35%', left: '10%', delay: 0.35 },
  { symbol: 'return', top: '65%', right: '12%', delay: 0.4 },
  { symbol: '01', top: '40%', right: '8%', delay: 0.45 },
]

export default function IntroAnimation({ onComplete }: { onComplete?: () => void }) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    // Check if intro has already played in this browser session
    const played = sessionStorage.getItem('codevision_intro_played')
    if (played) {
      setShow(false)
      onComplete?.()
      return
    }

    const timer = setTimeout(() => {
      setShow(false)
      sessionStorage.setItem('codevision_intro_played', 'true')
      onComplete?.()
    }, 2800)

    return () => clearTimeout(timer)
  }, [onComplete])

  const handleSkip = () => {
    setShow(false)
    sessionStorage.setItem('codevision_intro_played', 'true')
    onComplete?.()
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="reference-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#050814] text-white select-none overflow-hidden p-8 cursor-pointer"
          onClick={handleSkip}
        >
          {/* Subtle grid background & soft ambient glow */}
          <div className="absolute inset-0 bg-grid-fade opacity-30 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-sky-500/20 via-indigo-500/15 to-purple-500/25 blur-[140px] pointer-events-none" />

          {/* Floating glowing code symbols in background */}
          {codeSymbols.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 0.4, 0.2, 0.4],
                y: [0, -12, 0],
              }}
              transition={{
                duration: 4 + idx,
                repeat: Infinity,
                delay: item.delay,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                top: item.top,
                left: item.left,
                right: item.right,
              }}
              className="font-mono text-sm sm:text-base text-sky-400/60 pointer-events-none select-none drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]"
            >
              {item.symbol}
            </motion.div>
          ))}

          {/* Top-right floating code bracket */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 0.5, y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="self-end text-sky-400 font-mono text-2xl"
          >
            &lt;/&gt;
          </motion.div>

          {/* Center Title + Scanner + Tagline */}
          <div className="flex flex-col items-center text-center max-w-xl my-auto relative z-10">
            {/* Main Brand Title with Syne font */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.92, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight mb-4 drop-shadow-[0_0_40px_rgba(56,189,248,0.5)]"
            >
              CodeVision<span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-purple-400">.ai</span>
            </motion.h1>

            {/* Subtitle matching reference */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xs sm:text-sm font-mono tracking-[0.25em] text-sky-400/90 uppercase mb-8"
            >
              INITIALIZING A SMARTER WAY TO CODE...
            </motion.p>

            {/* Glowing gradient progress bar matching reference */}
            <div className="w-64 sm:w-80 h-1.5 rounded-full bg-slate-800/80 p-0.5 overflow-hidden border border-sky-500/25 shadow-[0_0_22px_rgba(56,189,248,0.35)]">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.3, ease: 'easeInOut' }}
                className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-500"
              />
            </div>

            {/* Slogan pill matching reference */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-[11px] font-mono tracking-[0.3em] text-slate-400 uppercase mt-8"
            >
              ANALYZE &nbsp;•&nbsp; UNDERSTAND &nbsp;•&nbsp; IMPROVE
            </motion.p>
          </div>

          {/* Bottom-left floating code bracket */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.5, y: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="self-start text-purple-400 font-mono text-2xl"
          >
            &lt;/&gt;
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
