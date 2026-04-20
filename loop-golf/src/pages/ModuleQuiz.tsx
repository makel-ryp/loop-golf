import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getModuleById } from '../data/modules'
import { isCorrect, calculateResult, getResultMessage, updateProgress } from '../data/quizUtils'
import { saveModuleProgress, getAllModuleProgress } from '../utils/firestoreHelpers'
import type { ModuleProgress } from '../types/modules'

type Screen = 'intro' | 'question' | 'feedback' | 'results'

export default function ModuleQuiz() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const module = getModuleById(id ?? '')
  const [screen, setScreen]       = useState<Screen>('intro')
  const [qIndex, setQIndex]       = useState(0)
  const [selected, setSelected]   = useState<string | null>(null)
  const [answers, setAnswers]     = useState<Record<string, string>>({})
  const [progress, setProgress]   = useState<ModuleProgress | null>(null)

  useEffect(() => {
    if (!user || !module) return
    getAllModuleProgress(user.uid).then(all => {
      const p = all.find(p => p.moduleId === module.id) ?? null
      setProgress(p)
    })
  }, [user, module])

  if (!module) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-ryp-mid text-sm">Module not found.</p>
      </div>
    )
  }

  const safeModule = module
  const question = safeModule.questions[qIndex]
  const result   = screen === 'results' ? calculateResult(safeModule, answers) : null

  function handleAnswer(option: string) {
    if (selected !== null) return
    setSelected(option)
    setAnswers(prev => ({ ...prev, [question.id]: option }))
    setScreen('feedback')
  }

  function handleNext() {
    if (qIndex < safeModule.questions.length - 1) {
      setQIndex(i => i + 1)
      setSelected(null)
      setScreen('question')
    } else {
      const finalAnswers = { ...answers }
      const r = calculateResult(safeModule, finalAnswers)
      const updated = updateProgress(progress ?? undefined, r)
      setProgress(updated)
      if (user) saveModuleProgress(user.uid, updated)
      setScreen('results')
    }
  }

  function handleRetry() {
    setScreen('intro')
    setQIndex(0)
    setSelected(null)
    setAnswers({})
  }

  // ── Intro ──
  if (screen === 'intro') return (
    <div className="px-5 pt-10 pb-8 max-w-lg mx-auto">
      <button
        onClick={() => navigate('/learn')}
        className="flex items-center gap-1.5 text-sm text-ryp-mid mb-8 hover:text-ryp-black transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3l-5 5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Learn
      </button>

      <div className="rounded-2xl px-6 py-5 mb-6" style={{ backgroundColor: module.lightColor }}>
        <div
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-white text-sm font-bold mb-3"
          style={{ backgroundColor: module.color }}
        >
          {module.number}
        </div>
        <h1 className="font-sans font-semibold text-2xl text-ryp-black tracking-tight mb-1">{module.title}</h1>
        <p className="text-sm font-medium mb-4" style={{ color: module.color }}>{module.subtitle}</p>
        <p className="text-sm text-ryp-black leading-relaxed">{module.intro}</p>
      </div>

      <div className="flex items-center justify-between mb-6 px-1">
        <div className="text-center">
          <p className="font-semibold text-lg text-ryp-black">{module.totalQuestions}</p>
          <p className="text-xs text-ryp-mid">Questions</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-lg text-ryp-black">{module.passingScore}/10</p>
          <p className="text-xs text-ryp-mid">To pass</p>
        </div>
        {progress?.passed ? (
          <div className="text-center">
            <p className="font-semibold text-lg text-ryp-black">{progress.bestScore}/10</p>
            <p className="text-xs text-ryp-mid">Best score</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="font-semibold text-lg text-ryp-black">{progress?.attempts ?? 0}</p>
            <p className="text-xs text-ryp-mid">Attempts</p>
          </div>
        )}
      </div>

      <button
        onClick={() => setScreen('question')}
        className="w-full py-3.5 text-white font-medium text-sm rounded-xl transition-opacity hover:opacity-90"
        style={{ backgroundColor: module.color }}
      >
        {progress?.attempts ? 'Retake quiz' : 'Start quiz'}
      </button>
    </div>
  )

  // ── Question / Feedback ──
  if (screen === 'question' || screen === 'feedback') return (
    <div className="px-5 pt-10 pb-8 max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate('/learn')} className="p-1 -ml-1 shrink-0">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4l-5 5 5 5" stroke="#888" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="flex-1 h-1.5 bg-black/8 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${((qIndex + (screen === 'feedback' ? 1 : 0)) / module.questions.length) * 100}%`,
              backgroundColor: module.color,
            }}
          />
        </div>
        <span className="text-xs text-ryp-mid shrink-0">{qIndex + 1}/{module.questions.length}</span>
      </div>

      {/* Tag */}
      <span
        className="inline-block text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full mb-4"
        style={{ backgroundColor: module.lightColor, color: module.color }}
      >
        {question.tag}
      </span>

      {/* Question */}
      <p className="font-sans font-medium text-base text-ryp-black leading-snug mb-6">{question.question}</p>

      {/* Options */}
      <div className="flex flex-col gap-2.5 mb-6">
        {question.options.map(option => {
          const isChosen   = selected === option
          const correct    = question.correctAnswer === option
          let style = 'border border-black/10 bg-white text-ryp-black'
          if (screen === 'feedback') {
            if (correct) style = 'border-2 bg-green-50 text-green-800 border-green-400'
            else if (isChosen) style = 'border-2 bg-red-50 text-red-700 border-red-300'
            else style = 'border border-black/8 bg-white/60 text-ryp-mid opacity-60'
          }
          return (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={screen === 'feedback'}
              className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${style}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span>{option}</span>
                {screen === 'feedback' && correct && (
                  <svg className="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" fill="#22c55e"/>
                    <path d="M4.5 8l2.5 2.5 4-4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {screen === 'feedback' && isChosen && !correct && (
                  <svg className="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" fill="#ef4444"/>
                    <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {screen === 'feedback' && (
        <div className="rounded-xl px-4 py-4 mb-6" style={{ backgroundColor: module.lightColor }}>
          <p className="text-xs font-semibold mb-1.5" style={{ color: module.color }}>
            {isCorrect(question, selected ?? '') ? 'Correct' : 'Incorrect'}
          </p>
          <p className="text-sm text-ryp-black leading-relaxed mb-3">{question.explanation}</p>
          <p className="text-xs text-ryp-mid italic">{question.memoryHook}</p>
        </div>
      )}

      {screen === 'feedback' && (
        <button
          onClick={handleNext}
          className="w-full py-3.5 text-white font-medium text-sm rounded-xl"
          style={{ backgroundColor: module.color }}
        >
          {qIndex < module.questions.length - 1 ? 'Next question' : 'See results'}
        </button>
      )}
    </div>
  )

  // ── Results ──
  if (screen === 'results' && result) return (
    <div className="px-5 pt-10 pb-8 max-w-lg mx-auto">
      <div className="rounded-2xl px-6 py-8 mb-6 text-center" style={{ backgroundColor: module.lightColor }}>
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full text-white text-3xl font-bold mb-4"
          style={{ backgroundColor: module.color }}
        >
          {result.score}
        </div>
        <p className="text-ryp-mid text-sm mb-1">out of {result.total}</p>
        <div className="flex items-center justify-center gap-2 mb-4">
          {result.passed ? (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Passed ✓</span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">Not yet</span>
          )}
        </div>
        <p className="text-sm text-ryp-black">{getResultMessage(result)}</p>
      </div>

      {/* Per-question summary */}
      <div className="flex flex-col gap-2 mb-8">
        {module.questions.map((q, i) => {
          const ans = answers[q.id]
          const correct = q.correctAnswer === ans
          return (
            <div key={q.id} className="flex items-center gap-3 px-4 py-3 bg-white border border-black/8 rounded-xl">
              <span className="text-xs text-ryp-mid w-5 shrink-0">{i + 1}</span>
              <span className="flex-1 text-xs text-ryp-black line-clamp-1">{q.question}</span>
              {correct
                ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#22c55e"/><path d="M4.5 8l2.5 2.5 4-4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#ef4444"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
              }
            </div>
          )
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleRetry}
          className="flex-1 py-3 border border-black/10 rounded-xl text-sm font-medium text-ryp-black hover:bg-black/5 transition-colors"
        >
          Retry
        </button>
        <button
          onClick={() => navigate('/learn')}
          className="flex-1 py-3 text-white font-medium text-sm rounded-xl"
          style={{ backgroundColor: module.color }}
        >
          Back to Learn
        </button>
      </div>
    </div>
  )

  return null
}
