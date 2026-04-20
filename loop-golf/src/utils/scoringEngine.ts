import type { ClubSummary } from './shotAnalyzer'

export interface ReadinessBreakdown {
  overallScore: number       // 0–100
  distanceScore: number      // 0–40
  consistencyScore: number   // 0–30
  knowledgeScore: number     // 0–30 (passed in from quiz)
}

const BENCHMARK_ORDER = ['I7', 'I8', 'I6', 'I9', 'I5', 'PW']

function getBenchmark(summaries: ClubSummary[]): ClubSummary | undefined {
  for (const club of BENCHMARK_ORDER) {
    const found = summaries.find((s) => s.club === club)
    if (found) return found
  }
  return summaries[0]
}

export function calcDistanceScore(summaries: ClubSummary[]): number {
  const b = getBenchmark(summaries)
  if (!b) return 0
  if (b.avgCarry >= 130) return 40
  if (b.avgCarry >= 110) return 30
  if (b.avgCarry >=  90) return 20
  return 10
}

export function calcConsistencyScore(summaries: ClubSummary[]): number {
  const b = getBenchmark(summaries)
  if (!b) return 0
  if (b.carryStdDev <=  8) return 30
  if (b.carryStdDev <= 15) return 20
  if (b.carryStdDev <= 22) return 10
  return 5
}

export function calcReadiness(
  summaries: ClubSummary[],
  knowledgeScore = 0
): ReadinessBreakdown {
  const distanceScore    = calcDistanceScore(summaries)
  const consistencyScore = calcConsistencyScore(summaries)
  return {
    overallScore: Math.min(100, distanceScore + consistencyScore + knowledgeScore),
    distanceScore,
    consistencyScore,
    knowledgeScore,
  }
}

export function readinessLabel(score: number): string {
  if (score >= 80) return 'Course Ready'
  if (score >= 60) return 'Almost There'
  if (score >= 40) return 'Keep Practicing'
  return 'Just Getting Started'
}

// ── Course length recommendation ───────────────────────────────────────────

export interface CourseLengthRec {
  sevenIronCarry: number
  minYards: number
  maxYards: number
  teeLabel: string
  rationale: string
}

export function recommendCourseLength(sevenIronCarry: number): CourseLengthRec {
  if (sevenIronCarry < 100) return { sevenIronCarry, minYards: 0,    maxYards: 4000, teeLabel: 'Par-3 / Executive',   rationale: 'Short par-3 and executive courses keep distances manageable while you build confidence.' }
  if (sevenIronCarry < 120) return { sevenIronCarry, minYards: 4000, maxYards: 5000, teeLabel: 'Forward Tees',        rationale: 'Forward tees bring par-4s into a comfortable range for your carry distance.' }
  if (sevenIronCarry < 140) return { sevenIronCarry, minYards: 5000, maxYards: 5800, teeLabel: 'Senior / Combo Tees', rationale: 'Combo tees give you realistic approach shots without over-stretching your irons.' }
  if (sevenIronCarry < 160) return { sevenIronCarry, minYards: 5800, maxYards: 6400, teeLabel: 'Middle Tees',         rationale: "Middle tees suit your carry distance well — you'll have a full iron into most par-4s." }
  if (sevenIronCarry < 175) return { sevenIronCarry, minYards: 6400, maxYards: 6800, teeLabel: 'Back Tees',           rationale: 'Your 7-iron carry supports back-tee distances; mid-irons reach most par-4 greens.' }
  return                          { sevenIronCarry, minYards: 6800, maxYards: 8000, teeLabel: 'Championship Tees',   rationale: 'Your ball speed and carry support championship yardages across the full bag.' }
}
