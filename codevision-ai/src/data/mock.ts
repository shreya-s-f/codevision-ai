export type Severity = 'critical' | 'high' | 'medium' | 'low'

export interface Repo {
  id: string
  name: string
  fullName: string
  language: string
  stars: number
  lastScan: string
  openIssues: number
  score: number
}

export interface Issue {
  id: string
  title: string
  file: string
  line: number
  severity: Severity
  type: 'bug' | 'security' | 'quality' | 'performance'
  description: string
  suggestion: string
  before: string
  after: string
  status: 'open' | 'fixed' | 'validated'
}

export const repos: Repo[] = [
  { id: 'r1', name: 'medilink-api', fullName: 'shreya/medilink-api', language: 'Python', stars: 42, lastScan: '2 hours ago', openIssues: 7, score: 82 },
  { id: 'r2', name: 'transit-tracker-web', fullName: 'shreya/transit-tracker-web', language: 'TypeScript', stars: 18, lastScan: 'Yesterday', openIssues: 3, score: 91 },
  { id: 'r3', name: 'civic-report-system', fullName: 'shreya/civic-report-system', language: 'PHP', stars: 9, lastScan: '3 days ago', openIssues: 12, score: 68 },
  { id: 'r4', name: 'traventure-frontend', fullName: 'shreya/traventure-frontend', language: 'JavaScript', stars: 25, lastScan: '5 days ago', openIssues: 5, score: 87 },
]

export const issues: Issue[] = [
  {
    id: 'i1',
    title: 'SQL query built via string concatenation',
    file: 'src/routes/patients.py',
    line: 84,
    severity: 'critical',
    type: 'security',
    description: 'User-supplied patient_id is concatenated directly into the SQL string, allowing injection of arbitrary SQL through the request parameter.',
    suggestion: 'Use parameterized queries so the driver escapes the value instead of the string being built by hand.',
    before: `query = "SELECT * FROM patients WHERE id = " + patient_id\ncursor.execute(query)`,
    after: `query = "SELECT * FROM patients WHERE id = %s"\ncursor.execute(query, (patient_id,))`,
    status: 'open',
  },
  {
    id: 'i2',
    title: 'Unhandled exception can crash the request thread',
    file: 'src/services/report_generator.py',
    line: 152,
    severity: 'high',
    type: 'bug',
    description: 'generate_report() calls an external PDF service without a try/except block. A timeout or 5xx response propagates as an unhandled exception.',
    suggestion: 'Wrap the external call and return a typed error response, and add a bounded retry with backoff.',
    before: `def generate_report(data):\n    result = pdf_service.render(data)\n    return result`,
    after: `def generate_report(data):\n    try:\n        result = pdf_service.render(data, timeout=8)\n    except PdfServiceError as exc:\n        logger.warning("pdf render failed", exc_info=exc)\n        raise ReportGenerationError("Could not generate report") from exc\n    return result`,
    status: 'open',
  },
  {
    id: 'i3',
    title: 'N+1 query when loading appointment list',
    file: 'src/services/appointments.py',
    line: 41,
    severity: 'medium',
    type: 'performance',
    description: 'Each appointment triggers a separate query to fetch the related doctor, resulting in one query per row instead of a single joined query.',
    suggestion: 'Use a join or prefetch to load doctors alongside appointments in one round trip.',
    before: `appointments = Appointment.query.all()\nfor a in appointments:\n    a.doctor = Doctor.query.get(a.doctor_id)`,
    after: `appointments = (\n    Appointment.query\n    .options(joinedload(Appointment.doctor))\n    .all()\n)`,
    status: 'fixed',
  },
  {
    id: 'i4',
    title: 'Duplicated validation logic across three handlers',
    file: 'src/routes/auth.py',
    line: 23,
    severity: 'low',
    type: 'quality',
    description: 'The same email/password validation block is repeated in login, register, and reset-password handlers, making future changes error-prone.',
    suggestion: 'Extract a shared validate_credentials() helper and reuse it across handlers.',
    before: `if "@" not in email or len(password) < 8:\n    return error("invalid")`,
    after: `def validate_credentials(email, password):\n    if "@" not in email or len(password) < 8:\n        raise ValidationError("invalid")`,
    status: 'validated',
  },
  {
    id: 'i5',
    title: 'API key committed in config file',
    file: 'config/settings.py',
    line: 12,
    severity: 'critical',
    type: 'security',
    description: 'A live third-party API key is hardcoded in a tracked file rather than read from the environment.',
    suggestion: 'Move the key to an environment variable and rotate the exposed credential.',
    before: `PDF_API_KEY = "sk_live_9f2a7d..."`,
    after: `PDF_API_KEY = os.environ["PDF_API_KEY"]`,
    status: 'open',
  },
  {
    id: 'i6',
    title: 'Missing null check before accessing nested field',
    file: 'src/services/notifications.py',
    line: 67,
    severity: 'medium',
    type: 'bug',
    description: 'user.profile.phone is accessed without checking that profile exists, causing an AttributeError for users who have not completed onboarding.',
    suggestion: 'Guard the access or default to None before formatting the SMS payload.',
    before: `phone = user.profile.phone`,
    after: `phone = user.profile.phone if user.profile else None`,
    status: 'open',
  },
]

export const workflowSteps = [
  { step: '01', title: 'Code Input', desc: 'Upload a repository or connect it directly from GitHub.' },
  { step: '02', title: 'Code Analysis', desc: 'Parse the codebase and identify changed files in the pull request.' },
  { step: '03', title: 'Issue Detection', desc: 'Run static analysis and security scanning across the diff.' },
  { step: '04', title: 'AI Review', desc: 'Retrieve repository context with RAG and reason over it with an LLM.' },
  { step: '05', title: 'Fix Generation', desc: 'Explain each issue in plain language and propose a concrete fix.' },
  { step: '06', title: 'Validation', desc: 'Apply the fix in an isolated sandbox, re-run tests, and re-scan.' },
]

export const objectives = [
  { title: 'Automated Code Review', desc: 'Review source code and pull requests automatically using AI and static-analysis techniques.' },
  { title: 'Bug & Quality Detection', desc: 'Identify bugs, code-quality issues, performance problems, and potential vulnerabilities.' },
  { title: 'Security-Focused Analysis', desc: 'Analyze code for security weaknesses and risky coding patterns.' },
  { title: 'Repository-Aware AI', desc: 'Use RAG to retrieve relevant code context before handing it to the LLM for review.' },
  { title: 'AI-Assisted Fixes', desc: 'Explain findings and propose code changes with a readable, reviewable diff.' },
  { title: 'Automated Validation', desc: 'Test proposed fixes and re-run security and code analysis before final approval.' },
]

export const techStack = [
  { layer: 'Presentation', items: ['React', 'TypeScript', 'HTML5', 'CSS'] },
  { layer: 'Application / Logic', items: ['FastAPI', 'Python', 'REST API', 'GitHub API'] },
  { layer: 'AI / ML', items: ['LLM', 'RAG', 'Embeddings', 'Prompt Engineering'] },
  { layer: 'Data', items: ['PostgreSQL', 'Repository Metadata', 'Review History'] },
  { layer: 'Infrastructure', items: ['Docker', 'Git', 'GitHub', 'CI/CD'] },
]

export const severityMeta: Record<Severity, { label: string; color: string; bg: string }> = {
  critical: { label: 'Critical', color: '#FF5C7A', bg: 'rgba(255,92,122,0.12)' },
  high: { label: 'High', color: '#F5A623', bg: 'rgba(245,166,35,0.12)' },
  medium: { label: 'Medium', color: '#7C93FF', bg: 'rgba(124,147,255,0.12)' },
  low: { label: 'Low', color: '#33D69F', bg: 'rgba(51,214,159,0.12)' },
}
