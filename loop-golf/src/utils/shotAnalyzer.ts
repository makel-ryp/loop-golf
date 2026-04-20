import type { ShotRecord } from './csvParser'

export interface ClubSummary {
  club: string
  displayName: string
  shots: number
  avgCarry: number
  carryStdDev: number       // carry consistency (lower = more consistent)
  avgOffline: number        // negative = left, positive = right
  avgMissYards: number      // absolute value
  missDirection: 'left' | 'right' | 'straight'
  avgBallSpeed: number
  avgLaunchAngle: number
  avgSpinRate: number
}

const CLUB_DISPLAY: Record<string, string> = {
  DR: 'Driver',
  W3: '3 Wood',  W5: '5 Wood',
  H3: '3 Hybrid', H4: '4 Hybrid', H5: '5 Hybrid',
  I3: '3 Iron',  I4: '4 Iron',  I5: '5 Iron',
  I6: '6 Iron',  I7: '7 Iron',  I8: '8 Iron',
  I9: '9 Iron',
  PW: 'Pitching Wedge', GW: 'Gap Wedge',
  SW: 'Sand Wedge',     LW: 'Lob Wedge',
}

const BAG_ORDER = ['DR','W3','W5','H3','H4','H5','I3','I4','I5','I6','I7','I8','I9','PW','GW','SW','LW']

function avg(nums: number[]) {
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

function stdDev(nums: number[]): number {
  if (nums.length < 2) return 0
  const mean = avg(nums)
  return Math.sqrt(nums.reduce((sum, v) => sum + (v - mean) ** 2, 0) / nums.length)
}

function round1(n: number) {
  return Math.round(n * 10) / 10
}

export function analyzeShots(shots: ShotRecord[]): ClubSummary[] {
  const grouped = new Map<string, ShotRecord[]>()

  for (const shot of shots) {
    const existing = grouped.get(shot.club) ?? []
    existing.push(shot)
    grouped.set(shot.club, existing)
  }

  const summaries: ClubSummary[] = []

  for (const [club, clubShots] of grouped.entries()) {
    const carries    = clubShots.map((s) => s.carry)
    const avgOffline = avg(clubShots.map((s) => s.offline))
    const absOffline = Math.abs(avgOffline)

    summaries.push({
      club,
      displayName:    CLUB_DISPLAY[club] ?? club,
      shots:          clubShots.length,
      avgCarry:       round1(avg(carries)),
      carryStdDev:    round1(stdDev(carries)),
      avgOffline:     round1(avgOffline),
      avgMissYards:   round1(absOffline),
      missDirection:  absOffline < 3 ? 'straight' : avgOffline < 0 ? 'left' : 'right',
      avgBallSpeed:   round1(avg(clubShots.map((s) => s.ballSpeed))),
      avgLaunchAngle: round1(avg(clubShots.map((s) => s.launchAngle))),
      avgSpinRate:    Math.round(avg(clubShots.map((s) => s.spinRate))),
    })
  }

  return summaries.sort(
    (a, b) => BAG_ORDER.indexOf(a.club) - BAG_ORDER.indexOf(b.club)
  )
}

export function getSevenIronCarry(summaries: ClubSummary[]): number | null {
  const FALLBACK = ['I7', 'I8', 'I6', 'I9', 'I5', 'PW']
  for (const club of FALLBACK) {
    const found = summaries.find((s) => s.club === club)
    if (found) return found.avgCarry
  }
  return null
}
