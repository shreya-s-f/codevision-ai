import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Lock, User, ArrowRight, Loader2, Sparkles, CheckCircle2,
  AlertCircle, Eye, EyeOff, ShieldCheck, MessageSquare, Lightbulb, Edit3
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
  const [rememberMe, setRememberMe] = useState(true)

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

      {/* MAIN SPLIT CONTENT MATCHING SCREEN 3 IN REFERENCE IMAGE */}
      <main className="relative z-10 container-xl flex-1 flex items-center py-6 sm:py-10">
        <div className="w-full grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ========================================================= */}
          {/* LEFT SIDE: BRANDING, 4 BULLET PILLS, DEVELOPER VISUAL     */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col justify-center space-y-6"
          >
            {/* BRAND TITLE */}
            <div>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-ink-hi">
                CodeVision<span className="grad-text">.ai</span>
              </h1>
              <p className="text-base sm:text-lg font-medium text-ink-mid mt-2 max-w-lg">
                An intelligent code review assistant that helps you understand and improve your code.
              </p>
            </div>

            {/* 4 CLEAR BULLET POINTS MATCHING REFERENCE SCREEN 3 */}
            <div className="space-y-3 pt-1">
              {[
                { text: 'Find problems in your code', icon: ShieldCheck },
                { text: 'Get simple explanations', icon: MessageSquare },
                { text: 'Receive useful suggestions', icon: Lightbulb },
                { text: 'Write better code', icon: Edit3 },
              ].map((item, idx) => {
                const Icon = item.icon
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border border-sky-400/20 bg-base-surface2/60 flex items-center gap-3.5 shadow-xs hover:border-sky-400/40 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 to-purple-500 flex items-center justify-center shrink-0 text-white shadow-sm">
                      <Icon size={16} />
                    </div>
                    <span className="text-sm text-ink-hi font-medium">{item.text}</span>
                  </div>
                )
              })}
            </div>

            {/* DEVELOPER CODING ILLUSTRATION WITH GLOWING HOLOGRAM </> */}
            <div className="relative rounded-2xl border border-sky-400/20 bg-gradient-to-br from-base-surface2/80 via-base-surface to-sky-950/20 p-5 overflow-hidden flex items-center justify-between shadow-glow-subtle">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active Workspace
                </span>
                <p className="text-xs text-ink-hi font-medium">Ready for real-time code review</p>
              </div>

              {/* Glowing Hologram code badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500/30 to-purple-500/30 border border-sky-400/50 flex items-center justify-center text-sky-300 font-mono font-bold text-xl shadow-[0_0_25px_rgba(56,189,248,0.4)]"
              >
                &lt;/&gt;
              </motion.div>
            </div>
          </motion.div>

          {/* ========================================================= */}
          {/* RIGHT SIDE: AUTHENTICATION CARD MATCHING SCREEN 3         */}
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

              {/* Mode switch tabs */}
              <div className="flex p-1 rounded-xl bg-base-surface2 border border-base-border mb-6">
                <button
                  type="button"
                  onClick={() => { setIsLogin(true); setErrorMsg(''); setSuccessMsg('') }}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                    isLogin
                      ? 'bg-base-bg text-sky-400 shadow-sm font-semibold'
                      : 'text-ink-mid hover:text-ink-hi'
                  }`}
                >
                  Login
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
                  Register
                </button>
              </div>

              {/* Card Title & Subtitle */}
              <div className="mb-5">
                <h2 className="font-display font-bold text-2xl text-ink-hi">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-xs text-ink-low mt-1">
                  {isLogin
                    ? 'Sign in to continue to CodeVision.ai'
                    : 'Start reviewing and fixing your code with AI in seconds'}
                </p>
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

                {/* Email or Username */}
                <div>
                  <label className="text-xs text-ink-mid mb-1.5 block font-medium">Email or Username</label>
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
                      placeholder="Enter your password"
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

                {/* Remember me & Forgot Password */}
                {isLogin && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-ink-mid hover:text-ink-hi">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-base-border text-sky-500 focus:ring-sky-400"
                      />
                      <span>Remember me</span>
                    </label>
                    <a href="#forgot" className="text-sky-400 hover:text-sky-300 font-medium">
                      Forgot password?
                    </a>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full text-base mt-2 flex items-center justify-center gap-2 font-semibold"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      {isLogin ? 'Login →' : 'Register →'}
                    </>
                  )}
                </button>
              </form>

              {/* Social Login Divider */}
              <div className="relative flex items-center justify-center my-5">
                <div className="h-px bg-base-border w-full" />
                <span className="bg-base-surface px-3 text-[11px] font-mono text-ink-low uppercase tracking-wider">
                  Or continue with
                </span>
                <div className="h-px bg-base-border w-full" />
              </div>

              {/* Social Login Buttons */}
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

              {/* Bottom footer toggle */}
              <div className="text-center text-sm text-ink-low">
                {isLogin ? (
                  <span>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setIsLogin(false); setErrorMsg(''); setSuccessMsg('') }}
                      className="text-sky-400 hover:text-sky-300 font-semibold"
                    >
                      Register
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setIsLogin(true); setErrorMsg(''); setSuccessMsg('') }}
                      className="text-sky-400 hover:text-sky-300 font-semibold"
                    >
                      Sign In
                    </button>
                  </span>
                )}
              </div>
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
