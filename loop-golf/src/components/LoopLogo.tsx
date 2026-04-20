interface LoopLogoProps {
  variant?: 'light' | 'dark'
  width?: number
}

export function LoopLogo({ variant = 'light', width = 160 }: LoopLogoProps) {
  const ballFill  = variant === 'dark' ? '#ffffff' : '#0D0D0D'
  const ballInner = variant === 'dark' ? '#f0f0f0' : '#222222'
  const pinStroke = variant === 'dark' ? '#ffffff' : '#0D0D0D'
  const cupFill   = variant === 'dark' ? '#111111' : '#0D0D0D'
  const cupInner  = variant === 'dark' ? '#1c1c1c' : '#2a2a2a'

  return (
    <svg viewBox="0 0 200 155" width={width} xmlns="http://www.w3.org/2000/svg">
      <path d="M14 112 Q100 12 172 100" fill="none" stroke="#00AF51" strokeWidth="4" strokeLinecap="round" />
      <circle cx="14" cy="112" r="6" fill={ballFill} />
      <circle cx="14" cy="112" r="4.5" fill={ballInner} />
      <ellipse cx="172" cy="107" rx="18" ry="6.5" fill={cupFill} />
      <ellipse cx="172" cy="105" rx="14" ry="5" fill={cupInner} />
      <line x1="172" y1="104" x2="172" y2="48" stroke={pinStroke} strokeWidth="3" strokeLinecap="round" />
      <polygon points="172,48 204,60 172,72" fill="#00AF51" />
      <text x="187" y="64" textAnchor="middle" fontSize="10" fontWeight="600" fill="#ffffff" fontFamily="sans-serif">18</text>
    </svg>
  )
}
