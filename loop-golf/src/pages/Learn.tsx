import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const modules = [
  {
    id: 'vocabulary',
    title: 'Vocabulary',
    description: 'Birdies, bogeys, and everything between. Learn the language of golf.',
    emoji: '📖',
    lessons: 12,
    color: 'bg-blue-50 border-blue-100',
    tag: 'Start here',
  },
  {
    id: 'etiquette',
    title: 'Etiquette',
    description: 'The unwritten rules that every golfer is expected to know.',
    emoji: '🤝',
    lessons: 8,
    color: 'bg-amber-50 border-amber-100',
    tag: null,
  },
  {
    id: 'pace',
    title: 'Pace of Play',
    description: 'Keep the round moving and stay in rhythm with the course.',
    emoji: '⏱',
    lessons: 6,
    color: 'bg-purple-50 border-purple-100',
    tag: null,
  },
  {
    id: 'scoring',
    title: 'Scoring & Rules',
    description: 'How strokes are counted, penalties, and the basics of the official rules.',
    emoji: '📋',
    lessons: 10,
    color: 'bg-ryp-green-tint border-green-100',
    tag: null,
  },
]

export default function Learn() {
  const [active, setActive] = useState<string | null>(null)
  const navigate = useNavigate()

  return (
    <div className="px-5 pt-10 pb-4 max-w-lg mx-auto">
      <h1 className="font-sans font-semibold text-2xl text-ryp-black tracking-tight mb-1">Learn</h1>
      <p className="text-sm text-ryp-mid mb-7">Work through each module at your own pace.</p>

      {/* Glossary quick-access */}
      <button
        onClick={() => navigate('/glossary')}
        className="w-full flex items-center justify-between px-5 py-4 mb-5 bg-ryp-black text-white rounded-xl hover:bg-ryp-black/90 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">📚</span>
          <div className="text-left">
            <div className="font-semibold text-sm">Golf Glossary</div>
            <div className="text-xs text-white/60 mt-0.5">124 terms — search and study at your own pace</div>
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-60">
          <path d="M6 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="flex flex-col gap-3">
        {modules.map((mod) => (
          <button
            key={mod.id}
            onClick={() => setActive(active === mod.id ? null : mod.id)}
            className={`w-full text-left border rounded-xl px-5 py-4 transition-all ${mod.color} ${active === mod.id ? 'ring-1 ring-ryp-green' : ''}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{mod.emoji}</span>
                  <span className="font-sans font-semibold text-base text-ryp-black">{mod.title}</span>
                  {mod.tag && (
                    <span className="text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 bg-ryp-green text-white rounded-full">
                      {mod.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-ryp-mid leading-relaxed">{mod.description}</p>
              </div>
              <svg
                width="16" height="16" viewBox="0 0 16 16" fill="none"
                className={`mt-1 shrink-0 transition-transform ${active === mod.id ? 'rotate-90' : ''}`}
              >
                <path d="M6 4l4 4-4 4" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {active === mod.id && (
              <div className="mt-4 pt-4 border-t border-black/8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-ryp-mid">{mod.lessons} lessons</span>
                  <span className="text-xs text-ryp-mid">0 / {mod.lessons} complete</span>
                </div>
                <div className="h-1.5 bg-black/8 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-ryp-green rounded-full w-0" />
                </div>
                <button className="w-full py-2.5 bg-ryp-black text-white text-sm font-medium rounded-lg">
                  Start module
                </button>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
