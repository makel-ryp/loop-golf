import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { modules } from '../data/modules'
import { getAllModuleProgress } from '../utils/firestoreHelpers'
import type { ModuleProgress } from '../types/modules'

export default function Learn() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [progress, setProgress] = useState<ModuleProgress[]>([])

  useEffect(() => {
    if (!user) return
    getAllModuleProgress(user.uid).then(setProgress)
  }, [user])

  function getProgress(moduleId: string) {
    return progress.find(p => p.moduleId === moduleId) ?? null
  }

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

      {/* Module cards */}
      <div className="flex flex-col gap-3">
        {modules.map((mod) => {
          const p = getProgress(mod.id)
          const attempted = !!p
          const passed = p?.passed ?? false

          return (
            <button
              key={mod.id}
              onClick={() => navigate(`/learn/module/${mod.id}`)}
              className="w-full text-left border border-black/8 rounded-xl px-5 py-4 bg-white hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Number badge */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: mod.color }}
                  >
                    {mod.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-sans font-semibold text-sm text-ryp-black">{mod.title}</span>
                      {passed && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Passed</span>
                      )}
                      {attempted && !passed && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                          {p!.bestScore}/10
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ryp-mid leading-relaxed">{mod.subtitle}</p>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-1 shrink-0 opacity-30">
                  <path d="M6 4l4 4-4 4" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Progress bar if attempted */}
              {attempted && (
                <div className="mt-3 ml-12">
                  <div className="h-1 bg-black/8 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(p!.bestScore / 10) * 100}%`,
                        backgroundColor: passed ? '#22c55e' : mod.color,
                      }}
                    />
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Overall progress summary */}
      {progress.length > 0 && (
        <div className="mt-6 px-5 py-4 bg-white border border-black/8 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-medium tracking-widest uppercase text-ryp-mid">Your progress</p>
            <p className="text-xs text-ryp-mid">{progress.filter(p => p.passed).length}/{modules.length} passed</p>
          </div>
          <div className="h-1.5 bg-black/8 rounded-full overflow-hidden">
            <div
              className="h-full bg-ryp-green rounded-full transition-all"
              style={{ width: `${(progress.filter(p => p.passed).length / modules.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
