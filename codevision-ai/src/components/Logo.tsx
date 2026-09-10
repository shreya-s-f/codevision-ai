export default function Logo({ withText = true, size = 28 }: { withText?: boolean; size?: number }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7C93FF" />
            <stop offset="1" stopColor="#C79BFF" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" className="fill-base-surface2" stroke="url(#logo-grad)" strokeWidth="1" />
        <path d="M10 11 L16 8 L22 11 L22 21 L16 24 L10 21 Z" fill="none" stroke="url(#logo-grad)" strokeWidth="1.6" />
        <circle cx="16" cy="16" r="2.6" fill="url(#logo-grad)" />
      </svg>
      {withText && (
        <span className="font-display font-semibold text-[17px] tracking-tight text-ink-hi">
          CodeVision<span className="grad-text">.ai</span>
        </span>
      )}
    </div>
  )
}
