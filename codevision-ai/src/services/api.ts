const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

export interface User {
  id: number
  email: string
  full_name: string
  role: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface ReviewFinding {
  id: string
  line: number
  severity: 'critical' | 'high' | 'medium' | 'low'
  type: 'security' | 'bug' | 'quality' | 'performance'
  title: string
  snippet: string
  description?: string
  suggestion: string
  before_code?: string
  after_code?: string
  status?: string
}

export interface AnalyzeResult {
  score: number
  total_findings: number
  critical_count: number
  high_count: number
  medium_count: number
  low_count: number
  findings: ReviewFinding[]
  ai_summary: string
  recommended_test_cases: string[]
}

export interface Repository {
  id: string
  name: string
  fullName: string
  language: string
  stars: number
  score: number
  openIssues: number
  lastScan: string
}

export interface ReviewItem {
  id: string
  title: string
  file: string
  line: number
  severity: 'critical' | 'high' | 'medium' | 'low'
  type: 'security' | 'bug' | 'quality' | 'performance'
  description: string
  suggestion: string
  before: string
  after: string
  status: 'open' | 'fixed' | 'validated'
}

export interface DashboardStats {
  total_reviews?: number
  issues_found?: number
  suggestions?: number
  projects?: number
  connected_repositories: number
  open_issues: number
  critical_findings: number
  average_score: string
}

function getAuthHeaders() {
  const token = localStorage.getItem('codevision_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const api = {
  async register(data: { email: string; full_name: string; password: string; role?: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || 'Registration failed')
    }
    return res.json()
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || 'Invalid email or password')
    }
    return res.json()
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Not authenticated')
    return res.json()
  },

  async analyze(code: string, filename = 'snippet.py', language = 'python'): Promise<AnalyzeResult> {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ code, filename, language }),
    })
    if (!res.ok) throw new Error('Analysis failed')
    return res.json()
  },

  async getStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE_URL}/stats`, {
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Could not fetch stats')
    return res.json()
  },

  async getRepositories(): Promise<Repository[]> {
    const res = await fetch(`${API_BASE_URL}/repositories`, {
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Could not fetch repositories')
    return res.json()
  },

  async createRepository(url: string, name?: string): Promise<Repository> {
    const res = await fetch(`${API_BASE_URL}/repositories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ url, name }),
    })
    if (!res.ok) throw new Error('Could not connect repository')
    return res.json()
  },

  async getReviews(severity?: string, issue_type?: string): Promise<ReviewItem[]> {
    const params = new URLSearchParams()
    if (severity && severity !== 'all') params.append('severity', severity)
    if (issue_type && issue_type !== 'all') params.append('issue_type', issue_type)
    const url = `${API_BASE_URL}/reviews${params.toString() ? '?' + params.toString() : ''}`
    const res = await fetch(url, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error('Could not fetch reviews')
    return res.json()
  },

  async applyFix(issueId: string, action: 'apply' | 'validate' = 'apply') {
    const res = await fetch(`${API_BASE_URL}/fixes/apply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ issue_id: issueId, action }),
    })
    if (!res.ok) throw new Error('Could not apply fix')
    return res.json()
  },

  async getHistory(): Promise<Array<{
    id: string
    title: string
    language: string
    score: number
    findings_count: number
    created_at: string
  }>> {
    const res = await fetch(`${API_BASE_URL}/history`, { headers: getAuthHeaders() })
    if (!res.ok) return []
    return res.json()
  },
}
