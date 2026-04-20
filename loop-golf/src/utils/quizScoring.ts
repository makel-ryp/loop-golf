import { QUIZ_QUESTIONS, type AnswerKey } from '../data/quizQuestions'

export type ActionTag =
  | 'complete_beginner'
  | 'vocab_basics'
  | 'etiquette_focus'
  | 'etiquette_rules'
  | 'etiquette_safety_first'
  | 'pace_of_play_focus'
  | 'budget_conscious'

export interface QuizScore {
  golfIQ: number          // 0–100
  rawPoints: number
  maxPoints: number
  actionTags: ActionTag[]
  categoryBreakdown: Record<string, number>
}

const MAX_POINTS = QUIZ_QUESTIONS.reduce(
  (sum, q) => sum + Math.max(...q.options.map((o) => o.points)),
  0
)

export function scoreQuiz(answers: Record<number, AnswerKey>): QuizScore {
  let rawPoints = 0
  const actionTags = new Set<ActionTag>()
  const categoryTotals: Record<string, number>   = {}
  const categoryMaxes: Record<string, number>    = {}

  for (const q of QUIZ_QUESTIONS) {
    const chosen = answers[q.id]
    if (!chosen) continue

    const option = q.options.find((o) => o.key === chosen)
    if (!option) continue

    rawPoints += option.points

    // Category breakdown
    categoryTotals[q.category] = (categoryTotals[q.category] ?? 0) + option.points
    categoryMaxes[q.category]  = (categoryMaxes[q.category]  ?? 0) + Math.max(...q.options.map((o) => o.points))

    // Action tags
    const tags = q.tags?.[chosen]
    tags?.forEach((t) => actionTags.add(t as ActionTag))
  }

  const golfIQ = Math.round((rawPoints / MAX_POINTS) * 100)

  // Normalize category breakdown to 0–100 per category
  const categoryBreakdown: Record<string, number> = {}
  for (const cat of Object.keys(categoryTotals)) {
    categoryBreakdown[cat] = Math.round((categoryTotals[cat] / categoryMaxes[cat]) * 100)
  }

  return {
    golfIQ,
    rawPoints,
    maxPoints: MAX_POINTS,
    actionTags: Array.from(actionTags),
    categoryBreakdown,
  }
}

export function golfIQLabel(score: number): string {
  if (score >= 80) return 'Loop Ready'
  if (score >= 60) return '19th Hole Regular'
  if (score >= 40) return 'Range Rat'
  return 'Fresh Off the Porch'
}

export function actionPlanItems(tags: ActionTag[]): string[] {
  const items: string[] = []
  if (tags.includes('complete_beginner'))       items.push('Start with Vocab Basics — learn the 10 clubs and what they do.')
  if (tags.includes('vocab_basics'))            items.push('Hit the Vocabulary module first — knowing your gear changes everything.')
  if (tags.includes('etiquette_safety_first'))  items.push('Read the Safety section in Etiquette before your first round.')
  if (tags.includes('etiquette_rules'))         items.push('The Etiquette module will cover putting-green order and flow.')
  if (tags.includes('etiquette_focus'))         items.push("The Etiquette module is built for you — it's your biggest unlock.")
  if (tags.includes('pace_of_play_focus'))      items.push('Pace of play tips are in the Etiquette module — they will calm that anxiety.')
  if (tags.includes('budget_conscious'))        items.push('Check the gear section — you can get on course for under $150.')
  if (!items.length)                            items.push("You've got a solid foundation — the Learn modules will sharpen the details.")
  return items
}
