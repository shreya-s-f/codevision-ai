import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center relative">
      <div className="absolute inset-0 bg-aurora opacity-70 pointer-events-none" />
      <div className="relative flex flex-col items-center gap-6">
        <Logo />
        <h1 className="h-display text-6xl grad-text">404</h1>
        <p className="text-ink-mid max-w-sm">This file wasn't found in the repository index. Let's get you back to a known branch.</p>
        <Link to="/" className="btn-primary">Back to home</Link>
      </div>
    </div>
  )
}
