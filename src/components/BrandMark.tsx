interface BrandMarkProps {
  size?: number
}

/** The ESCAPE sunrise-over-peaks mark. */
export function BrandMark({ size = 34 }: BrandMarkProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="brand-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f97316" />
          <stop offset="1" stopColor="#facc15" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#brand-sky)" />
      <circle cx="32" cy="30" r="8" fill="#fff7ed" />
      <path d="M6 52l14-20 8 10 6-8 24 18z" fill="#1c1917" />
    </svg>
  )
}