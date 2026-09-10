import { motion } from 'framer-motion'
import { Cpu, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react'

export default function ScanPanel() {
  return (
    <div className="relative w-full max-w-[540px] mx-auto select-none">
      {/* Ambient glowing radial blur */}
      <div className="absolute -inset-4 bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20 blur-2xl opacity-70 pointer-events-none rounded-3xl" />

      {/* Main 3D angled glassmorphic code card matching reference */}
      <div className="relative card rounded-2xl border border-sky-400/30 bg-base-surface/85 backdrop-blur-xl shadow-2xl overflow-hidden">
        
        {/* macOS window header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-base-border bg-base-surface2/60">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400/90 inline-block shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-amber-400/90 inline-block shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-emerald-400/90 inline-block shadow-xs" />
          </div>
          <span className="font-mono text-xs text-sky-400 font-semibold tracking-wide">
            calculate.py
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-sky-400/30 bg-sky-500/10 text-[11px] text-sky-300 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
            AI Active
          </div>
        </div>

        {/* Code Content & Connected AI Chip */}
        <div className="relative p-5 sm:p-6 flex flex-col gap-4 font-mono text-xs sm:text-sm">
          {/* Laser scanning beam */}
          <motion.div
            className="absolute left-0 right-0 h-16 bg-gradient-to-b from-sky-400/10 via-purple-400/15 to-transparent pointer-events-none"
            initial={{ top: '-10%' }}
            animate={{ top: ['-10%', '110%'] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 text-slate-300">
              <p>
                <span className="text-purple-400 font-semibold">def</span>{' '}
                <span className="text-sky-300">calculate</span>(a, b):
              </p>
              <p className="pl-4">
                <span className="text-purple-400">if</span> b == <span className="text-amber-300">0</span>:
              </p>
              <p className="pl-8 bg-red-500/10 text-red-300 py-0.5 px-1 rounded">
                <span className="text-purple-400">return</span> <span className="text-amber-300">"Error"</span>
              </p>
              <p className="pl-4">
                <span className="text-purple-400">return</span> a / b
              </p>
            </div>

            {/* Glowing AI Chip Graphic matching reference */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative shrink-0 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-sky-400/50 bg-gradient-to-br from-sky-500/20 via-indigo-600/30 to-purple-600/30 shadow-[0_0_25px_rgba(56,189,248,0.5)]"
            >
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-400 to-purple-500 opacity-30 blur-xs animate-pulse" />
              <Cpu size={24} className="text-sky-300 mb-0.5" />
              <span className="font-display font-black text-sm text-white tracking-widest">AI</span>
            </motion.div>
          </div>

          {/* Code Review Comments */}
          <div className="pt-2 text-[11px] text-sky-400/90 font-mono space-y-0.5 border-t border-base-border">
            <p># Code reviewed by AI</p>
            <p># Suggestions: 2 potential improvements identified</p>
          </div>
        </div>

        {/* Review Status Footer Bar matching reference */}
        <div className="grid grid-cols-3 divide-x divide-base-border border-t border-base-border bg-base-surface2/50 text-center py-2.5 text-[11px] font-mono">
          <div className="flex items-center justify-center gap-1.5 text-red-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>Issues Found: 2</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-purple-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Suggestions: 3</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Code Quality: Good</span>
          </div>
        </div>

      </div>
    </div>
  )
}
