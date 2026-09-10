import { severityMeta, Severity } from '../data/mock'

export default function SeverityBadge({ severity }: { severity: Severity }) {
  const meta = severityMeta[severity]
  return (
    <span
      className="pill border"
      style={{ color: meta.color, background: meta.bg, borderColor: `${meta.color}33` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
      {meta.label}
    </span>
  )
}
