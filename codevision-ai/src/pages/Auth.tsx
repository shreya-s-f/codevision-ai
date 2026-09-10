import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Lock, User, ArrowRight, Loader2, Sparkles, CheckCircle2,
  AlertCircle, Eye, EyeOff, ShieldCheck, Terminal, Code2
} from 'lucide-react'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
import { useAuth } from '../context/AuthContext'

export default function AuthPage({ initialMode = 'login' }: { initialMode?: 'login' | 'signup' }) {
  const location = useLocation()
  const isSignupRoute = location.pathname === '/signup' || initialMode === 'signup'
  const [isLogin, setIsLogin] = useState(!isSignupRoute)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('Developer')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const { login, register, demoLogin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    // Client validation
    if (!isLogin && password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.')
      return
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.')
      return
    }

    setLoading(true)

    try {
      if (isLogin) {
        await login(email, password)
        setSuccessMsg('Logged in successfully! Redirecting…')
      } else {
        await register(email, fullName, password, role)
        setSuccessMsg('Account created successfully! Redirecting…')
      }
      setTimeout(() => navigate('/app'), 600)
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoSignIn = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      await demoLogin()
      setSuccessMsg('Signed in as demo user! Redirecting…')
      setTimeout(() => navigate('/app'), 600)
    } catch {
      navigate('/app')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-bg text-ink-hi flex flex-col justify-between relative overflow-hidden transition-colors duration-200">
      {/* Ambient background light blue & purple glows */}
      <div className="absolute inset-0 bg-grid-fade pointer-events-none opacity-40" />
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

      {/* Header bar */}
      <header className="relative z-20 container-xl py-6 flex items-center justify-between">
        <Link to="/" className="transition-transform hover:scale-[1.02]">
          <Logo size={32} />
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/"
            className="text-xs font-mono uppercase tracking-wider text-ink-mid hover:text-sky-400 px-3 py-1.5 rounded-xl border border-base-border bg-base-surface2 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* MAIN SPLIT CONTENT:
          LEFT SIDE: CodeVision.ai branding, simple-English description, animated code snippet & visuals
          RIGHT SIDE: Modern Login / Register form */}
      <main className="relative z-10 container-xl flex-1 flex items-center py-6 sm:py-10">
        <div className="w-full grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ========================================================= */}
          {/* LEFT SIDE: BRANDING, SIMPLE DESCRIPTION, ANIMATED VISUALS */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col justify-center space-y-6"
          >
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-400/30 bg-sky-500/10 text-sky-400 text-xs font-mono w-fit">
              <Sparkles size={13} className="text-purple-400" />
              <span>AI Code Review Assistant</span>
            </div>

            {/* BRAND TITLE */}
            <div>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-ink-hi">
                CodeVision<span className="grad-text">.ai</span>
              </h1>
              <p className="text-base sm:text-lg font-medium text-ink-mid mt-2">
                Simple, intelligent code reviews for everyone.
              </p>
            </div>

            {/* SIMPLE ENGLISH DESCRIPTION AS SPECIFIED BY USER */}
            <div className="card p-6 border-sky-400/20 bg-base-surface/70 backdrop-blur-md shadow-card relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-15 font-mono text-xs select-none pointer-events-none text-sky-400">
                &lt;code /&gt;
              </div>
              <p className="text-sm sm:text-base text-ink-hi leading-relaxed">
                CodeVision.ai is an AI-powered tool that helps developers review their code, find problems, understand errors, and improve their code.
              </p>
              <p className="text-xs sm:text-sm text-ink-mid leading-relaxed mt-3 pt-3 border-t border-base-border">
                It checks your files automatically, explains issues in simple English, and gives you ready-to-use fixes so you can write cleaner, safer software with confidence.
              </p>
            </div>

            {/* ANIMATED CODE SNIPPET VISUAL PANEL WITH LIGHT BLUE & PURPLE ACCENTS */}
            <div className="rounded-2xl border border-sky-400/30 bg-base-surface2/60 p-4 font-mono text-xs relative overflow-hidden shadow-glow-subtle">
              {/* Top window controls */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-base-border text-[11px] text-ink-low">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block" />
                  <span className="ml-2 font-mono text-ink-mid">app_review.py</span>
                </div>
                <span className="text-[10px] text-sky-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                  AI Inspector Running
                </span>
              </div>

              {/* Code lines */}
              <div className="space-y-1.5 text-ink-mid text-[11.5px] leading-5">
                <p>
                  <span className="text-ink-low select-none">1</span>{' '}
                  <span className="text-purple-400 font-semibold">def</span>{' '}
                  <span className="text-sky-300">save_user</span>(request):
                </p>
                <p className="bg-red-500/10 px-1 rounded text-red-300">
                  <span className="text-red-400 font-mono text-[10px]"># Warning: SQL query built via string concatenation</span>
                </p>
                <p>
                  <span className="text-ink-low select-none">2</span>{' '}
                  &nbsp;&nbsp;query = <span className="text-amber-300">"SELECT * FROM users WHERE id = %s"</span>
                </p>
                <p className="bg-emerald-500/10 px-1 rounded text-emerald-300">
                  <span className="text-emerald-400 font-mono text-[10px]">✓ CodeVision AI: Parameterized query applied safely</span>
                </p>
                <p>
                  <span className="text-ink-low select-none">3</span>{' '}
                  &nbsp;&nbsp;<span className="text-purple-400">return</span> db.execute(query, (user_id,))
                </p>
              </div>

              {/* Animated laser scan line */}
              <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-purple-400 opacity-70 animate-scan" />
            </div>

            {/* 4 CLEAR BULLET POINTS FROM MOCKUP #3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {[
                'Find problems in your code',
                'Get simple explanations',
                'Receive useful suggestions',
                'Write better code',
              ].map((point, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-sky-400/20 bg-base-surface2/60 flex items-center gap-3 shadow-xs hover:border-sky-400/40 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-sky-400 to-purple-400 flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-sm">
                    ✓
                  </div>
                  <span className="text-xs text-ink-hi font-medium">{point}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ========================================================= */}
          {/* RIGHT SIDE: MODERN LOGIN / REGISTER FORM                  */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6 w-full max-w-[480px] mx-auto lg:ml-auto"
          >
            <div className="card p-7 sm:p-9 shadow-2xl border-base-border relative overflow-hidden">
              {/* Top gradient accent border */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400" />

              <div className="mb-5">
                <h2 className="font-display font-bold text-2xl text-ink-hi">
                  {isLogin ? 'Welcome Back!' : 'Create Account'}
                </h2>
                <p className="text-xs text-ink-low mt-1">
                  {isLogin
                    ? 'Enter your credentials to access your CodeVision.ai dashboard'
                    : 'Start reviewing and fixing your code with AI in seconds'}
                </p>
              </div>

              {/* Mode switch tabs */}
              <div className="flex p-1 rounded-xl bg-base-surface2 border border-base-border mb-5">
                <button
                  type="button"
                  onClick={() => { setIsLogin(true); setErrorMsg(''); setSuccessMsg('') }}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                    isLogin
                      ? 'bg-base-bg text-sky-400 shadow-sm font-semibold'
                      : 'text-ink-mid hover:text-ink-hi'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setIsLogin(false); setErrorMsg(''); setSuccessMsg('') }}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                    !isLogin
                      ? 'bg-base-bg text-purple-400 shadow-sm font-semibold'
                      : 'text-ink-mid hover:text-ink-hi'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* SOCIAL LOGIN BUTTONS FROM MOCKUP #3 */}
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  title="Sign in with Google"
                  className="p-2.5 rounded-xl border border-base-border bg-base-surface2/60 hover:bg-base-surface hover:border-sky-400/40 flex items-center justify-center transition-all group"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 12s.7 2.3 1.9 4.7l3.7-1.9z"/>
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  title="Sign in with GitHub"
                  className="p-2.5 rounded-xl border border-base-border bg-base-surface2/60 hover:bg-base-surface hover:border-sky-400/40 flex items-center justify-center transition-all group"
                >
                  <svg className="w-4 h-4 fill-current text-ink-hi" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  title="Sign in with Microsoft"
                  className="p-2.5 rounded-xl border border-base-border bg-base-surface2/60 hover:bg-base-surface hover:border-sky-400/40 flex items-center justify-center transition-all group"
                >
                  <svg className="w-4 h-4" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                </button>
              </div>

              <div className="relative flex items-center justify-center mb-5">
                <div className="h-px bg-base-border w-full" />
                <span className="bg-base-surface px-3 text-[11px] font-mono text-ink-low uppercase tracking-wider">
                  or with email
                </span>
                <div className="h-px bg-base-border w-full" />
              </div>

              {/* Error / Success Messages */}
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs flex items-center gap-2"
                >
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs flex items-center gap-2"
                >
                  <CheckCircle2 size={15} className="shrink-0" />
                  <span>{successMsg}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      key="signup-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col gap-4 overflow-hidden"
                    >
                      {/* Full Name */}
                      <div>
                        <label className="text-xs text-ink-mid mb-1.5 block font-medium">Your Name</label>
                        <div className="relative">
                          <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-low" />
                          <input
                            required
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                            className="input-field pl-10 text-sm"
                          />
                        </div>
                      </div>

                      {/* Role selection */}
                      <div>
                        <label className="text-xs text-ink-mid mb-1.5 block font-medium">I am a</label>
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="input-field text-sm"
                        >
                          <option value="Developer">Software Developer</option>
                          <option value="Student">Student / Learner</option>
                          <option value="Code Reviewer">Code Reviewer / QA</option>
                          <option value="Teacher">Teacher / Educator</option>
                        </select>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Address */}
                <div>
                  <label className="text-xs text-ink-mid mb-1.5 block font-medium">Email address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-low" />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input-field pl-10 text-sm"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-ink-mid font-medium">Password</label>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-low" />
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="input-field pl-10 pr-10 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-low hover:text-ink-hi"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD (ONLY ON REGISTER) */}
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div
                      key="confirm-password-field"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <label className="text-xs text-ink-mid mb-1.5 block font-medium">Confirm Password</label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-low" />
                        <input
                          required
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter your password"
                          className="input-field pl-10 pr-10 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-low hover:text-ink-hi"
                        >
                          {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full text-sm mt-2 flex items-center justify-center gap-2 font-semibold"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      {isLogin ? 'Sign In to Dashboard' : 'Create My Account'}
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              {/* Quick access divider */}
              <div className="relative flex items-center justify-center my-5">
                <div className="h-px bg-base-border w-full" />
                <span className="bg-base-surface px-3 text-[11px] font-mono text-ink-low uppercase tracking-wider">
                  Quick Access
                </span>
                <div className="h-px bg-base-border w-full" />
              </div>

              {/* Demo Sign In Button */}
              <button
                type="button"
                onClick={handleDemoSignIn}
                disabled={loading}
                className="btn-secondary w-full text-xs justify-center py-2.5 flex items-center gap-2"
              >
                <Sparkles size={14} className="text-sky-400" /> Demo Sign In (Explore Instantly)
              </button>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 container-xl py-6 text-center text-xs text-ink-low border-t border-base-border">
        © 2026 CodeVision.ai — AI Code Review Assistant. Simple, secure code for everyone.
      </footer>
    </div>
  )
}
