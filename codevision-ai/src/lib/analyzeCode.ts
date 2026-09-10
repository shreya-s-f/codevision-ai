export type Severity = 'critical' | 'high' | 'medium' | 'low'

export interface Finding {
  id: string
  line: number
  severity: Severity
  type: 'security' | 'bug' | 'quality' | 'performance'
  title: string
  snippet: string
  suggestion: string
}

interface Rule {
  test: RegExp
  severity: Severity
  type: Finding['type']
  title: string
  suggestion: string
}

// Each rule is checked line-by-line against the pasted snippet. This runs entirely
// in the browser - no network call - so it works offline and instantly.
const rules: Rule[] = [
  {
    test: /(SELECT|INSERT|UPDATE|DELETE)[^"'`]*["'`]\s*\+/i,
    severity: 'critical',
    type: 'security',
    title: 'Possible SQL injection via string concatenation',
    suggestion: 'Use parameterized queries / prepared statements instead of building SQL with string concatenation.',
  },
  {
    test: /(api[_-]?key|secret|password|token)\s*[:=]\s*["'`][A-Za-z0-9_\-\.]{8,}["'`]/i,
    severity: 'critical',
    type: 'security',
    title: 'Hardcoded credential or secret',
    suggestion: 'Move this value into an environment variable or secrets manager and rotate the exposed credential.',
  },
  {
    test: /\beval\s*\(/,
    severity: 'critical',
    type: 'security',
    title: 'Use of eval() is a code-injection risk',
    suggestion: 'Avoid eval(); use JSON.parse, a safe expression parser, or refactor to remove dynamic execution.',
  },
  {
    test: /except\s*:\s*$|except\s*:\s*pass/,
    severity: 'high',
    type: 'bug',
    title: 'Bare except silently swallows all errors',
    suggestion: 'Catch a specific exception type and log or handle it instead of silently passing.',
  },
  {
    test: /catch\s*\([^)]*\)\s*\{\s*\}/,
    severity: 'high',
    type: 'bug',
    title: 'Empty catch block swallows errors',
    suggestion: 'Log the error or handle it explicitly; an empty catch hides failures from users and monitoring.',
  },
  {
    test: /\b(console\.log|print)\s*\(/,
    severity: 'low',
    type: 'quality',
    title: 'Debug statement left in code',
    suggestion: 'Remove this before merging, or replace it with a proper logger call at the right log level.',
  },
  {
    test: /\bTODO\b|\bFIXME\b/,
    severity: 'low',
    type: 'quality',
    title: 'Unresolved TODO / FIXME comment',
    suggestion: 'Track this in an issue tracker or resolve it before merging so it is not forgotten.',
  },
  {
    test: /for\s*\([^)]*\)\s*\{[^}]*\.(query|get|find)\(/,
    severity: 'medium',
    type: 'performance',
    title: 'Possible N+1 query pattern inside a loop',
    suggestion: 'Batch this into a single query (join, prefetch, or IN clause) instead of querying per iteration.',
  },
  {
    test: /\.innerHTML\s*=/,
    severity: 'high',
    type: 'security',
    title: 'Direct innerHTML assignment can enable XSS',
    suggestion: 'Sanitize the value first, or use textContent / a templating layer that escapes HTML by default.',
  },
  {
    test: /^.{121,}$/,
    severity: 'low',
    type: 'quality',
    title: 'Line exceeds 120 characters',
    suggestion: 'Break this line up for readability, or extract part of the expression into a named variable.',
  },
]

export function analyzeCode(code: string): Finding[] {
  const lines = code.split('\n')
  const findings: Finding[] = []
  let counter = 0

  lines.forEach((line, idx) => {
    rules.forEach((rule) => {
      if (rule.test.test(line)) {
        counter += 1
        findings.push({
          id: `f${counter}`,
          line: idx + 1,
          severity: rule.severity,
          type: rule.type,
          title: rule.title,
          snippet: line.trim().slice(0, 140),
          suggestion: rule.suggestion,
        })
      }
    })
  })

  const order: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 }
  return findings.sort((a, b) => order[a.severity] - order[b.severity])
}

export const sampleSnippet = `def get_patient(request):
    pid = request.args.get("id")
    query = "SELECT * FROM patients WHERE id = " + pid
    result = db.execute(query)

    api_key = "sk_live_9f2a7d3e8b1c4f0a"

    try:
        send_notification(result)
    except:
        pass

    print("debug:", result)
    # TODO: paginate this response
    return result
`
