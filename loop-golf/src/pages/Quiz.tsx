import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { QUIZ_QUESTIONS, type AnswerKey } from '../data/quizQuestions'
import { scoreQuiz, golfIQLabel, actionPlanItems } from '../utils/quizScoring'
import { saveQuizResult } from '../utils/firestoreHelpers'
import { LoopLogo } from '../components/LoopLogo'

const CATEGORIES = [...new Set(QUIZ_QUESTIONS.map((q) => q.category))]

type Stage = 'intro' | 'quiz' | 'results'

export default function Quiz() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [stage, setStage]       = useState<Stage>('intro')
  const [current, setCurrent]   = useState(0)
  const [answers, setAnswers]   = useState<Record<number, AnswerKey>>({})
  const [saving, setSaving]     = useState(false)
  const [result, setResult]     = useState<ReturnType<typeof scoreQuiz> | null>(null)

  const question = QUIZ_QUESTIONS[current]
  const progress = ((current) / QUIZ_QUESTIONS.length) * 100

  function selectAnswer(key: AnswerKey) {
    setAnswers((prev) => ({ ...prev, [question.id]: key }))
  }

  function next() {
    if (current < QUIZ_QUESTIONS.length - 1) {
      setCurrent((c) => c + 1)
    } else {
      const scored = scoreQuiz(answers)
      setResult(scored)
      setStage('results')
    }
  }

  function back() {
    if (current > 0) setCurrent((c) => c - 1)
  }

  async function finish() {
    if (!user || !result) return
    setSaving(true)
    try {
      await saveQuizResult(user.uid, {
        golfIQ:            result.golfIQ,
        rawPoints:         result.rawPoints,
        maxPoints:         result.maxPoints,
        answers,
        actionTags:        result.actionTags,
        categoryBreakdown: result.categoryBreakdown,
      })
      navigate('/learn')
    } catch {
      navigate('/learn')
    } finally {
      setSaving(false)
    }
  }

  // ── Intro ──────────────────────────────────────────────────────────────
  if (stage === 'intro') {
    return (
      <div className="min-h-screen bg-ryp-off-white flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-8">
            <LoopLogo width={100} />
          </div>
          <h1 className="font-serif text-4xl text-ryp-black mb-3">
            Golf IQ <em className="text-ryp-green">Check</em>
          </h1>
          <p className="text-sm text-ryp-mid leading-relaxed mb-2 max-w-sm mx-auto">
            20 quick questions. No wrong answers — honest ones just give you better recommendations.
          </p>
          <p className="text-xs text-ryp-mid mb-10">Takes about 3 minutes.</p>

          <div className="flex flex-col gap-2 mb-8 text-left max-w-xs mx-auto">
            {CATEGORIES.map((cat) => (
              <div key={cat} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-ryp-green flex-shrink-0" />
                <span className="text-sm text-ryp-black">{cat}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStage('quiz')}
            className="w-full max-w-xs mx-auto block py-3.5 bg-ryp-green text-white font-medium text-sm rounded hover:bg-ryp-green-dark transition-colors"
          >
            Start the quiz
          </button>
        </div>
      </div>
    )
  }

  // ── Results ────────────────────────────────────────────────────────────
  if (stage === 'results' && result) {
    const label = golfIQLabel(result.golfIQ)
    const plan  = actionPlanItems(result.actionTags)

    return (
      <div className="min-h-screen bg-ryp-off-white flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          <div className="flex justify-center mb-8">
            <LoopLogo width={90} />
          </div>

          {/* Score card */}
          <div className="bg-ryp-black rounded-lg px-8 py-10 text-center mb-4">
            <p className="text-[11px] font-medium tracking-widest uppercase text-ryp-green mb-3">
              Your Golf IQ
            </p>
            <div className="font-serif text-8xl text-white leading-none mb-3">
              {result.golfIQ}
            </div>
            <span className="inline-block bg-ryp-green text-ryp-green-deep text-[10px] font-medium tracking-widest uppercase px-4 py-1.5 rounded-full">
              {label}
            </span>
          </div>

          {/* Category breakdown */}
          <div className="bg-white border border-black/8 rounded-lg px-6 py-6 mb-4">
            <p className="text-[11px] font-medium tracking-widest uppercase text-ryp-mid mb-4">Breakdown</p>
            <div className="flex flex-col gap-3">
              {Object.entries(result.categoryBreakdown).map(([cat, score]) => (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ryp-black">{cat}</span>
                    <span className="text-ryp-mid">{score}</span>
                  </div>
                  <div className="h-1.5 bg-black/8 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-ryp-green rounded-full transition-all"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action plan */}
          <div className="bg-white border border-black/8 rounded-lg px-6 py-6 mb-6">
            <p className="text-[11px] font-medium tracking-widest uppercase text-ryp-mid mb-4">Your Action Plan</p>
            <div className="flex flex-col gap-3">
              {plan.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-ryp-green-tint flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="#00AF51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-sm text-ryp-black leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={finish}
            disabled={saving}
            className="w-full py-3.5 bg-ryp-green text-white font-medium text-sm rounded hover:bg-ryp-green-dark disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : 'Head to the Learn module →'}
          </button>
        </div>
      </div>
    )
  }

  // ── Quiz ───────────────────────────────────────────────────────────────
  const selectedAnswer = answers[question.id]

  return (
    <div className="min-h-screen bg-ryp-off-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        {/* Progress */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-1 bg-black/8 rounded-full overflow-hidden">
            <div
              className="h-full bg-ryp-green rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-ryp-mid whitespace-nowrap">
            {current + 1} / {QUIZ_QUESTIONS.length}
          </span>
        </div>

        {/* Question card */}
        <div className="bg-white border border-black/8 rounded-lg px-8 py-8 mb-4">
          <p className="text-[10px] font-medium tracking-widest uppercase text-ryp-green mb-4">
            {question.category}
          </p>
          <h2 className="font-sans font-medium text-xl text-ryp-black leading-snug mb-6">
            {question.question}
          </h2>

          <div className="flex flex-col gap-2.5">
            {question.options.map((opt) => {
              const selected = selectedAnswer === opt.key
              return (
                <button
                  key={opt.key}
                  onClick={() => selectAnswer(opt.key)}
                  className={`flex items-start gap-3.5 px-4 py-3.5 rounded border text-left transition-colors ${
                    selected
                      ? 'border-ryp-green bg-ryp-green-tint'
                      : 'border-black/12 bg-ryp-off-white hover:border-ryp-black'
                  }`}
                >
                  <span className={`text-xs font-medium tracking-wide w-4 flex-shrink-0 mt-0.5 ${selected ? 'text-ryp-green' : 'text-ryp-mid'}`}>
                    {opt.key}
                  </span>
                  <span className={`text-sm leading-relaxed ${selected ? 'text-ryp-green-deep font-medium' : 'text-ryp-black'}`}>
                    {opt.text}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {current > 0 && (
            <button
              onClick={back}
              className="flex-1 py-3 border border-black/12 text-ryp-black font-medium text-sm rounded hover:border-ryp-black transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={next}
            disabled={!selectedAnswer}
            className="flex-1 py-3 bg-ryp-green text-white font-medium text-sm rounded hover:bg-ryp-green-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {current === QUIZ_QUESTIONS.length - 1 ? 'See my Golf IQ' : 'Next'}
          </button>
        </div>

      </div>
    </div>
  )
}
