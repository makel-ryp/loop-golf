import { useMemo } from 'react'
import type { ShotRecord } from '../utils/csvParser'

// One distinct color per club
const CLUB_COLORS: Record<string, string> = {
  DR: '#60A5FA',  // blue
  W3: '#22D3EE',  // cyan
  W5: '#6EE7B7',  // teal
  H3: '#4ADE80',  // green
  H4: '#86EFAC',
  H5: '#BBF7D0',
  I3: '#FCD34D',  // yellow
  I4: '#FBBF24',  // amber
  I5: '#FB923C',  // orange
  I6: '#F87171',  // red
  I7: '#F472B6',  // pink
  I8: '#C084FC',  // purple
  I9: '#A78BFA',  // violet
  PW: '#818CF8',  // indigo
  GW: '#E879F9',  // fuchsia
  SW: '#FB7185',  // rose
  LW: '#FDE68A',  // pale yellow
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

function stdDev(nums: number[]) {
  if (nums.length < 2) return 0
  const m = mean(nums)
  return Math.sqrt(nums.reduce((s, v) => s + (v - m) ** 2, 0) / nums.length)
}

export function ShotDispersionChart({ shots }: { shots: ShotRecord[] }) {
  // SVG canvas
  const VW = 280
  const VH = 460
  const PAD = { top: 24, right: 46, bottom: 28, left: 20 }
  const CW  = VW - PAD.left - PAD.right   // 214
  const CH  = VH - PAD.top  - PAD.bottom  // 408

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

  // Coordinate transforms — origin at bottom-centre
  const toX = (offline: number) =>
    PAD.left + ((offline + offlineMax) / (2 * offlineMax)) * CW

  const toY = (carry: number) =>
    PAD.top + (1 - carry / carryMax) * CH

  const centerX = toX(0)

  return (
    <div className="rounded-xl overflow-hidden">
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="w-full"
        style={{ background: '#080d0a' }}
      >
        <defs>
          {/* Soft fairway glow down the center */}
          <radialGradient id="fairwayGlow" cx="50%" cy="60%" r="30%">
            <stop offset="0%"   stopColor="#1a3320" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#080d0a" stopOpacity="0"   />
          </radialGradient>
        </defs>

        {/* Fairway glow */}
        <rect x="0" y="0" width={VW} height={VH} fill="url(#fairwayGlow)" />

        {/* Fairway strip */}
        <rect
          x={toX(-12)} y={PAD.top}
          width={toX(12) - toX(-12)} height={CH}
          fill="rgba(30,60,35,0.25)"
        />

        {/* Distance arc lines */}
        {distanceMarks.map(d => {
          const y = toY(d)
          // Slight arc: quadratic bezier drooping toward tee
          const sag = (d / carryMax) * 6
          const d1  = PAD.left
          const d2  = VW - PAD.right
          const mx  = (d1 + d2) / 2
          return (
            <g key={d}>
              <path
                d={`M ${d1} ${y} Q ${mx} ${y + sag} ${d2} ${y}`}
                fill="none"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="0.75"
              />
              <text
                x={VW - PAD.right + 4} y={y + 3.5}
                fill="rgba(255,255,255,0.35)"
                fontSize="8"
                fontFamily="DM Sans, sans-serif"
              >
                {d}y
              </text>
            </g>
          )
        })}

        {/* Target line */}
        <line
          x1={centerX} y1={PAD.top}
          x2={centerX} y2={PAD.top + CH}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.75"
          strokeDasharray="3,5"
        />

        {/* Dispersion ellipses (drawn first so dots sit on top) */}
        {clubsPresent.map(club => {
          const cs     = byClub.get(club)!
          const color  = CLUB_COLORS[club] ?? '#fff'
          const offs   = cs.map(s => s.offline)
          const cars   = cs.map(s => s.carry)
          const cx     = toX(mean(offs))
          const cy     = toY(mean(cars))

          // 1.5-sigma ellipse, minimum size enforced
          const sdOff  = Math.max(stdDev(offs), 2)
          const sdCar  = Math.max(stdDev(cars), 3)
          const rx     = Math.max((sdOff * 1.5) / (2 * offlineMax) * CW, 8)
          const ry     = Math.max((sdCar * 1.5) / carryMax * CH, 12)

          return (
            <ellipse
              key={club}
              cx={cx} cy={cy} rx={rx} ry={ry}
              fill="none"
              stroke={color}
              strokeWidth="1.25"
              opacity="0.55"
            />
          )
        })}

        {/* Shot dots */}
        {shots.map((shot, i) => (
          <circle
            key={i}
            cx={toX(shot.offline)}
            cy={toY(shot.carry)}
            r="2.5"
            fill={CLUB_COLORS[shot.club] ?? '#fff'}
            opacity="0.9"
          />
        ))}

        {/* Club labels above each ellipse */}
        {clubsPresent.map(club => {
          const cs    = byClub.get(club)!
          const color = CLUB_COLORS[club] ?? '#fff'
          const offs  = cs.map(s => s.offline)
          const cars  = cs.map(s => s.carry)
          const cx    = toX(mean(offs))
          const cy    = toY(mean(cars))
          const sdCar = Math.max(stdDev(cars), 3)
          const ry    = Math.max((sdCar * 1.5) / carryMax * CH, 12)

          return (
            <text
              key={`lbl-${club}`}
              x={cx} y={cy - ry - 4}
              textAnchor="middle"
              fill={color}
              fontSize="7.5"
              fontWeight="600"
              fontFamily="DM Sans, sans-serif"
              opacity="0.9"
            >
              {CLUB_ABBREV[club] ?? club}
            </text>
          )
        })}

        {/* Offline scale */}
        {([-offlineMax * 0.5, offlineMax * 0.5] as number[]).map(v => (
          <text
            key={v}
            x={toX(v)} y={VH - 6}
            textAnchor="middle"
            fill="rgba(255,255,255,0.22)"
            fontSize="7"
            fontFamily="DM Sans, sans-serif"
          >
            {Math.round(Math.abs(v))}y {v < 0 ? 'L' : 'R'}
          </text>
        ))}
      </svg>
    </div>
  )
}
