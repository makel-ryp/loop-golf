import { useMemo } from 'react'
import type { ShotRecord } from '../utils/csvParser'

const CLUB_COLORS: Record<string, string> = {
  DR: '#60A5FA', W3: '#22D3EE', W5: '#6EE7B7',
  H3: '#4ADE80', H4: '#86EFAC', H5: '#BBF7D0',
  I3: '#FCD34D', I4: '#FBBF24', I5: '#FB923C',
  I6: '#F87171', I7: '#F472B6', I8: '#C084FC',
  I9: '#A78BFA', PW: '#818CF8', GW: '#E879F9',
  SW: '#FB7185', LW: '#FDE68A',
}

const CLUB_ABBREV: Record<string, string> = {
  DR: 'DR', W3: '3W', W5: '5W',
  H3: '3H', H4: '4H', H5: '5H',
  I3: '3i', I4: '4i', I5: '5i',
  I6: '6i', I7: '7i', I8: '8i', I9: '9i',
  PW: 'PW', GW: 'GW', SW: 'SW', LW: 'LW',
}

const BAG_ORDER = ['DR','W3','W5','H3','H4','H5','I3','I4','I5','I6','I7','I8','I9','PW','GW','SW','LW']

function mean(nums: number[]) {
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

interface EllipseParams {
  cx: number; cy: number
  rx: number; ry: number
  angleDeg: number
}

// PCA on screen-space points → rotated ellipse that wraps the actual visual scatter
function fitEllipse(xs: number[], ys: number[]): EllipseParams {
  const n  = xs.length
  const mx = mean(xs)
  const my = mean(ys)

  let cxx = 0, cyy = 0, cxy = 0
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx
    const dy = ys[i] - my
    cxx += dx * dx
    cyy += dy * dy
    cxy += dx * dy
  }
  cxx /= n; cyy /= n; cxy /= n

  // Rotation angle of the major axis via half-angle formula
  const angleDeg = (0.5 * Math.atan2(2 * cxy, cxx - cyy)) * (180 / Math.PI)

  // Eigenvalues = semi-axis variances
  const term   = Math.sqrt(Math.max(0, ((cxx - cyy) / 2) ** 2 + cxy ** 2))
  const lam1   = (cxx + cyy) / 2 + term   // major
  const lam2   = (cxx + cyy) / 2 - term   // minor

  const SCALE  = 1.75   // ~1.75σ covers ~92% of bivariate-normal data
  const rx     = Math.max(SCALE * Math.sqrt(Math.max(lam1, 0)), 9)
  const ry     = Math.max(SCALE * Math.sqrt(Math.max(lam2, 0)), 5)

  return { cx: mx, cy: my, rx, ry, angleDeg }
}

export function ShotDispersionChart({ shots }: { shots: ShotRecord[] }) {
  const VW = 280
  const VH = 460
  const PAD = { top: 24, right: 46, bottom: 28, left: 20 }
  const CW  = VW - PAD.left - PAD.right
  const CH  = VH - PAD.top  - PAD.bottom

  const { carryMax, offlineMax, distanceMarks, byClub, clubsPresent } = useMemo(() => {
    const carries  = shots.map(s => s.carry)
    const offlines = shots.map(s => s.offline)
    const carryMax   = Math.max(Math.ceil(Math.max(...carries)  / 50) * 50, 100)
    const offlineAbs = Math.max(Math.abs(Math.min(...offlines)), Math.abs(Math.max(...offlines)))
    const offlineMax = Math.max(Math.ceil(offlineAbs / 10) * 10, 20)

    const distanceMarks: number[] = []
    for (let d = 50; d <= carryMax; d += 50) distanceMarks.push(d)

    const byClub = new Map<string, ShotRecord[]>()
    for (const s of shots) {
      const arr = byClub.get(s.club) ?? []
      arr.push(s)
      byClub.set(s.club, arr)
    }
    const clubsPresent = [...byClub.keys()].sort(
      (a, b) => BAG_ORDER.indexOf(a) - BAG_ORDER.indexOf(b)
    )
    return { carryMax, offlineMax, distanceMarks, byClub, clubsPresent }
  }, [shots])

  const toX = (offline: number) =>
    PAD.left + ((offline + offlineMax) / (2 * offlineMax)) * CW
  const toY = (carry: number) =>
    PAD.top + (1 - carry / carryMax) * CH

  const centerX = toX(0)

  // Pre-compute PCA ellipses in screen coordinates
  const ellipses = useMemo(() =>
    clubsPresent.map(club => {
      const cs = byClub.get(club)!
      const xs = cs.map(s => toX(s.offline))
      const ys = cs.map(s => toY(s.carry))
      return { club, color: CLUB_COLORS[club] ?? '#fff', ...fitEllipse(xs, ys) }
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clubsPresent, byClub, carryMax, offlineMax]
  )

  return (
    <div className="rounded-xl overflow-hidden">
      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ background: '#080d0a' }}>
        <defs>
          <radialGradient id="fairwayGlow" cx="50%" cy="60%" r="30%">
            <stop offset="0%"   stopColor="#1a3320" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#080d0a" stopOpacity="0"   />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width={VW} height={VH} fill="url(#fairwayGlow)" />

        {/* Fairway strip */}
        <rect
          x={toX(-12)} y={PAD.top}
          width={toX(12) - toX(-12)} height={CH}
          fill="rgba(30,60,35,0.25)"
        />

        {/* Distance arc lines */}
        {distanceMarks.map(d => {
          const y   = toY(d)
          const sag = (d / carryMax) * 6
          const mx  = (PAD.left + VW - PAD.right) / 2
          return (
            <g key={d}>
              <path
                d={`M ${PAD.left} ${y} Q ${mx} ${y + sag} ${VW - PAD.right} ${y}`}
                fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.75"
              />
              <text
                x={VW - PAD.right + 4} y={y + 3.5}
                fill="rgba(255,255,255,0.35)" fontSize="8"
                fontFamily="DM Sans, sans-serif"
              >{d}y</text>
            </g>
          )
        })}

        {/* Target line */}
        <line
          x1={centerX} y1={PAD.top} x2={centerX} y2={PAD.top + CH}
          stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" strokeDasharray="3,5"
        />

        {/* Rotated dispersion ellipses */}
        {ellipses.map(({ club, color, cx, cy, rx, ry, angleDeg }) => (
          <ellipse
            key={club}
            cx={cx} cy={cy} rx={rx} ry={ry}
            transform={`rotate(${angleDeg}, ${cx}, ${cy})`}
            fill="none"
            stroke={color}
            strokeWidth="1.25"
            opacity="0.6"
          />
        ))}

        {/* Shot dots */}
        {shots.map((shot, i) => (
          <circle
            key={i}
            cx={toX(shot.offline)} cy={toY(shot.carry)}
            r="2.5"
            fill={CLUB_COLORS[shot.club] ?? '#fff'}
            opacity="0.9"
          />
        ))}

        {/* Offline scale */}
        {([-offlineMax * 0.5, offlineMax * 0.5] as number[]).map(v => (
          <text
            key={v} x={toX(v)} y={VH - 6}
            textAnchor="middle"
            fill="rgba(255,255,255,0.22)" fontSize="7"
            fontFamily="DM Sans, sans-serif"
          >
            {Math.round(Math.abs(v))}y {v < 0 ? 'L' : 'R'}
          </text>
        ))}

        {/* Legend — bottom-left, 3 columns */}
        {(() => {
          const cols     = 3
          const rowH     = 10
          const colW     = 30
          const padX     = 5
          const padY     = 5
          const rows     = Math.ceil(clubsPresent.length / cols)
          const boxW     = cols * colW + padX * 2
          const boxH     = rows * rowH + padY * 2
          const bx       = PAD.left + 2
          const by       = PAD.top + CH - boxH - 2

          return (
            <g>
              <rect
                x={bx} y={by} width={boxW} height={boxH}
                rx="3" fill="rgba(0,0,0,0.55)"
              />
              {clubsPresent.map((club, i) => {
                const col  = i % cols
                const row  = Math.floor(i / cols)
                const x    = bx + padX + col * colW
                const y    = by + padY + row * rowH + 6
                const color = CLUB_COLORS[club] ?? '#fff'
                return (
                  <g key={`leg-${club}`}>
                    <circle cx={x + 3} cy={y - 2} r="2.5" fill={color} />
                    <text
                      x={x + 8} y={y}
                      fill="rgba(255,255,255,0.75)"
                      fontSize="6.5" fontFamily="DM Sans, sans-serif"
                    >
                      {CLUB_ABBREV[club] ?? club}
                    </text>
                  </g>
                )
              })}
            </g>
          )
        })()}
      </svg>
    </div>
  )
}
