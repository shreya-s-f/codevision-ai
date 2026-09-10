import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Bug, MessageSquare, Sparkles, Code2, Play, Pause,
  CheckCircle2, ShieldCheck, FileCode
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SectionHeading from '../components/SectionHeading'
import ScanPanel from '../components/ScanPanel'
import IntroAnimation from '../components/IntroAnimation'
import { techStack } from '../data/mock'

// The 4 bottom hero cards from Screen 2 in the reference image
const fourFeaturePills = [
  {
    icon: Bug,
    line1: 'Find Issues',
    line2: 'in Your Code',
    tone: 'text-sky-400 border-sky-400/30 bg-sky-500/10',
  },
  {
    icon: MessageSquare,
    line1: 'Get Simple',
    line2: 'Explanations',
    tone: 'text-purple-400 border-purple-400/30 bg-purple-500/10',
  },
  {
    icon: Sparkles,
    line1: 'Receive',
    line2: 'Smart Suggestions',
    tone: 'text-indigo-400 border-indigo-400/30 bg-indigo-500/10',
  },
  {
    icon: Code2,
    line1: 'Write Better',
    line2: 'Code',
    tone: 'text-cyan-400 border-cyan-400/30 bg-cyan-500/10',
  },
]

// The 5 visual How It Works steps matching reference
const howItWorksSteps = [
  {
    step: '01',
    title: 'Add Your Code',
    desc: 'Paste a snippet of code directly or connect your project repository.',
  },
  {
    step: '02',
    title: 'CodeVision.ai Checks It',
    desc: 'The system examines the code and looks for possible errors, security issues, and areas that can be improved.',
  },
  {
    step: '03',
    title: 'Understand the Problem',
    desc: 'The system explains what is wrong in simple English so you can understand the issue right away.',
  },
  {
    step: '04',
    title: 'Get Suggestions',
    desc: 'You receive clear, useful suggestions and ready-to-apply corrected code.',
  },
  {
    step: '05',
    title: 'Improve Your Code',
    desc: 'Apply the suggestions with one click to keep your project secure, clean, and reliable.',
  },
]

export default function Landing() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)

  // Interactive background particle canvas effect with light blue/purple hues
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Generate tech particles
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      alpha: number
      color: string
    }> = []

    const colors = ['rgba(56,189,248,', 'rgba(192,132,252,', 'rgba(129,140,248,']

    for (let i = 0; i < 48; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.45 + 0.15,
        color: colors[i % colors.length],
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw particle connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(129, 140, 248, ${0.12 * (1 - dist / 130)})`
            ctx.lineWidth = 0.75
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${p.alpha})`
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const toggleVideoPlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  return (
    <div className="overflow-x-hidden bg-base-bg text-ink-hi transition-colors duration-200">
      {/* 1. SCREEN 1: STANDALONE OPENING ANIMATION */}
      <IntroAnimation />

      <Navbar />

      {/* 2. HERO SECTION MATCHING SCREEN 2 IN REFERENCE IMAGE */}
      <section id="hero" className="relative min-h-[92vh] flex flex-col justify-center pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
        
        {/* VIDEO BACKGROUND & NEON OVERLAY */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-15 filter contrast-125"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-matrix-style-green-code-and-data-lines-41584-large.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 video-glow-overlay" />
          <div className="absolute inset-0 bg-aurora opacity-75" />
          <div className="absolute inset-0 bg-grid-fade opacity-40" />
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-70" />
        </div>

        {/* Video toggle badge */}
        <div className="absolute bottom-4 right-6 z-20 hidden md:flex items-center gap-2 p-1.5 rounded-xl border border-base-border bg-base-surface/80 backdrop-blur-md text-xs text-ink-low">
          <button
            onClick={toggleVideoPlay}
            className="p-1 rounded-lg hover:bg-base-surface2 hover:text-ink-hi transition-colors text-sky-400"
            title={isPlaying ? 'Pause Video' : 'Play Video'}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          </button>
          <span className="font-mono text-[10px] pr-2 text-ink-mid">AI Code Intelligence Active</span>
        </div>

        {/* HERO MAIN ROW */}
        <div className="container-xl relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* HERO LEFT COLUMN */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            {/* Tagline Chip matching reference */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 text-sky-400 text-xs font-mono mb-6 shadow-xs">
              <Sparkles size={13} className="text-purple-400" />
              <span>YOUR AI CODING COMPANION</span>
            </div>

            {/* Main Title matching reference */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[62px] leading-[1.08] tracking-tight font-extrabold mb-5 text-ink-hi">
              AI Code Review <br />
              <span className="grad-text">Assistant</span>
            </h1>

            {/* Description matching reference */}
            <p className="text-ink-mid text-base sm:text-[17px] leading-[1.65] max-w-[620px] mb-8 font-normal">
              CodeVision.ai helps developers check their code, find possible problems, understand errors, and improve their code with helpful suggestions.
            </p>

            {/* Two Action Buttons matching reference */}
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/signup" className="btn-primary !py-3.5 !px-8 rounded-full text-base font-semibold shadow-glow flex items-center gap-2">
                Get Started →
              </Link>
              <a
                href="#workflow"
                className="btn-secondary !py-3 !px-6 rounded-full text-sm font-medium border-base-border hover:border-sky-400/50"
              >
                Learn How It Works
              </a>
            </div>
          </motion.div>

          {/* HERO RIGHT COLUMN: 3D CODE WINDOW & AI CHIP MATCHING REFERENCE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <ScanPanel />
          </motion.div>

        </div>

        {/* 4 FEATURE CARDS STRIP AT BOTTOM OF HERO MATCHING REFERENCE IMAGE */}
        <div className="container-xl relative z-10 mt-10 sm:mt-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {fourFeaturePills.map((card, i) => (
              <motion.div
                key={card.line1}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                className="card p-4 rounded-xl border border-sky-400/20 bg-base-surface/80 backdrop-blur-md hover:border-sky-400/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3.5 shadow-xs"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${card.tone}`}>
                  <card.icon size={19} />
                </div>
                <div className="leading-snug min-w-0">
                  <p className="font-display text-sm font-bold text-ink-hi truncate">{card.line1}</p>
                  <p className="font-display text-xs sm:text-sm font-medium text-ink-mid truncate">{card.line2}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </section>

      {/* TECH MARQUEE */}
      <section className="border-y border-base-border py-4 bg-base-surface2/30 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex items-center gap-12 pr-12 text-ink-low text-xs font-mono">
              {[
                'FastAPI Python Backend',
                'Next.js & TypeScript',
                'PostgreSQL Database',
                'Automatic Code Checks',
                'AI Language Model',
                'JWT Authentication',
                'Instant Code Fixes',
                'Unit Test Synthesis',
              ].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400/80" /> {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* 12. "HOW IT WORKS" SECTION — 5 SIMPLE VISUAL STEPS */}
      <section id="workflow" className="py-24 bg-base-surface/40 border-y border-base-border">
        <div className="container-xl">
          <SectionHeading
            eyebrow="How It Works"
            title="Five simple steps to better code."
            desc="Here is how CodeVision.ai helps you inspect and fix your code in seconds."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-14">
            {howItWorksSteps.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="card p-5 flex flex-col justify-between relative overflow-hidden group hover:border-sky-400/50 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sky-400 to-purple-400 opacity-60" />
                <div>
                  <span className="font-mono text-xs text-sky-400 font-semibold block mb-3">
                    STEP {step.step}
                  </span>
                  <h3 className="h-display text-sm font-semibold mb-2">{step.title}</h3>
                  <p className="text-xs text-ink-mid leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES BREAKDOWN */}
      <section id="features" className="py-24">
        <div className="container-xl">
          <SectionHeading
            eyebrow="Core Capabilities"
            title="Designed for developers, students, and teams."
            desc="CodeVision.ai simplifies code review so you can ship quality software faster."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
            <div className="card p-6 border-sky-400/20 hover:border-sky-400/50 transition-all card-hover">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 mb-4">
                <Bug size={18} />
              </div>
              <h3 className="h-display text-base font-semibold mb-2">Code Analysis</h3>
              <p className="text-xs text-ink-mid leading-relaxed">
                Check code for possible problems, vulnerabilities, and syntax errors automatically.
              </p>
            </div>

            <div className="card p-6 border-purple-400/20 hover:border-purple-400/50 transition-all card-hover">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-400 mb-4">
                <MessageSquare size={18} />
              </div>
              <h3 className="h-display text-base font-semibold mb-2">Problem Explanation</h3>
              <p className="text-xs text-ink-mid leading-relaxed">
                Understand what went wrong in simple English without confusing technical jargon.
              </p>
            </div>

            <div className="card p-6 border-indigo-400/20 hover:border-indigo-400/50 transition-all card-hover">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center text-indigo-400 mb-4">
                <Sparkles size={18} />
              </div>
              <h3 className="h-display text-base font-semibold mb-2">Suggestions</h3>
              <p className="text-xs text-ink-mid leading-relaxed">
                Get suggestions and ready-to-use code patches to improve your codebase immediately.
              </p>
            </div>

            <div className="card p-6 border-cyan-400/20 hover:border-cyan-400/50 transition-all card-hover">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-4">
                <Code2 size={18} />
              </div>
              <h3 className="h-display text-base font-semibold mb-2">Better Code</h3>
              <p className="text-xs text-ink-mid leading-relaxed">
                Use the review results to improve your code, prevent bugs, and write safer software.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION MATCHING SAAS SPEC */}
      <section id="about" className="py-20 border-t border-base-border bg-base-surface/30">
        <div className="container-xl max-w-4xl text-center">
          <SectionHeading
            eyebrow="About CodeVision.ai"
            title="A clean interface for a smarter tomorrow."
            desc="CodeVision.ai combines deep static analysis rules with LLM reasoning to automate code reviews, catch vulnerabilities before production, and generate ready-to-merge patches."
            align="center"
          />
        </div>
      </section>

      {/* BOTTOM CALL TO ACTION */}
      <section className="py-24 text-center border-t border-base-border relative overflow-hidden">
        <div className="container-xl relative z-10 max-w-2xl mx-auto">
          <h2 className="h-display text-3xl sm:text-4xl mb-4">
            Ready to review your code with <span className="grad-text">CodeVision.ai</span>?
          </h2>
          <p className="text-ink-mid text-sm mb-8">
            Create an account or sign in to start reviewing your code and getting AI fix suggestions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary !py-3 !px-7 rounded-full text-sm font-semibold shadow-glow">
              Get Started <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-secondary !py-3 !px-6 rounded-full text-sm">
              Sign In
            </Link>
            <Link to="/app" className="btn-secondary !py-3 !px-6 rounded-full text-sm">
              Open Dashboard
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
