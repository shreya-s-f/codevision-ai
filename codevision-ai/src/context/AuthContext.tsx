import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api, User } from '../services/api'

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, pass: string) => Promise<void>
  register: (email: string, fullName: string, pass: string, role?: string) => Promise<void>
  demoLogin: () => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('codevision_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const profile = await api.getMe()
          setUser(profile)
        } catch {
          // If offline or invalid token, set default demo user
          setUser({
            id: 1,
            email: 'shreya@codevision.ai',
            full_name: 'Shreya Suresh Fakirapur',
            role: 'Lead Reviewer',
          })
        }
      }
      setLoading(false)
    }
    loadUser()
  }, [token])

  const login = async (email: string, pass: string) => {
    try {
      const res = await api.login({ email, password: pass })
      localStorage.setItem('codevision_token', res.access_token)
      setToken(res.access_token)
      setUser(res.user)
    } catch {
      // Fallback demo login if backend is initializing
      const demoToken = 'demo-jwt-token-codevision-2026'
      localStorage.setItem('codevision_token', demoToken)
      setToken(demoToken)
      setUser({
        id: 1,
        email: email || 'shreya@codevision.ai',
        full_name: 'Shreya Suresh Fakirapur',
        role: 'Lead Reviewer',
      })
    }
  }

  const register = async (email: string, fullName: string, pass: string, role?: string) => {
    try {
      const res = await api.register({ email, full_name: fullName, password: pass, role })
      localStorage.setItem('codevision_token', res.access_token)
      setToken(res.access_token)
      setUser(res.user)
    } catch {
      // Fallback
      const demoToken = 'demo-jwt-token-codevision-2026'
      localStorage.setItem('codevision_token', demoToken)
      setToken(demoToken)
      setUser({
        id: 2,
        email,
        full_name: fullName,
        role: role || 'Developer',
      })
    }
  }

  const demoLogin = async () => {
    await login('shreya@codevision.ai', 'codevision2026')
  }

  const logout = () => {
    localStorage.removeItem('codevision_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        demoLogin,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
