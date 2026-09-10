export default function DiffBlock({ before, after }: { before: string; after: string }) {
  const beforeLines = before.split('\n')
  const afterLines = after.split('\n')

  return (
    <div className="grid md:grid-cols-2 gap-3">
      <div className="rounded-xl border border-signal-red/25 bg-signal-red/5 overflow-hidden">
        <div className="px-3.5 py-2 text-[11px] font-mono uppercase tracking-wide text-signal-red border-b border-signal-red/20 bg-signal-red/10">
          Before
        </div>
        <pre className="px-3.5 py-3 text-[12.5px] font-mono leading-6 overflow-x-auto">
          {beforeLines.map((l, i) => (
            <div key={i} className="text-ink-mid">
              <span className="text-signal-red/60 select-none mr-3">−</span>
              {l}
            </div>
          ))}
        </pre>
      </div>
      <div className="rounded-xl border border-signal-green/25 bg-signal-green/5 overflow-hidden">
        <div className="px-3.5 py-2 text-[11px] font-mono uppercase tracking-wide text-signal-green border-b border-signal-green/20 bg-signal-green/10">
          After (AI suggested)
        </div>
        <pre className="px-3.5 py-3 text-[12.5px] font-mono leading-6 overflow-x-auto">
          {afterLines.map((l, i) => (
            <div key={i} className="text-ink-hi">
              <span className="text-signal-green/70 select-none mr-3">+</span>
              {l}
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}
