import { useState } from 'react'
import { useUserData } from '../context/UserDataContext'

function getCourseRecommendation(sevenIronCarry: number | null) {
  if (sevenIronCarry === null) return null
  if (sevenIronCarry < 100) return { type: 'Par 3 Course', yardage: '1,500 – 2,500 yds', desc: 'Short, forgiving, and perfect for building confidence.' }
  if (sevenIronCarry < 120) return { type: 'Executive Course', yardage: '3,000 – 4,200 yds', desc: 'A mix of par 3s and short par 4s — ideal for your current game.' }
  if (sevenIronCarry < 140) return { type: 'Short Municipal', yardage: '4,200 – 5,000 yds', desc: "Forward tees on a full-length course. You're ready for this." }
  return { type: 'Championship (Forward Tees)', yardage: '5,000 – 5,400 yds', desc: "Full-length course from the forward markers. Let's go." }
}

const PRE_ROUND_CHECKLIST = [
  'Arrive 15 minutes early to warm up',
  'Have at least 6 golf balls in your bag',
  'Know the basic local rules before teeing off',
  'Keep up with the group ahead — not behind',
  'Rake bunkers and repair divots as you go',
  'Silence your phone on the tee box',
  'Have fun — score is secondary today',
]

export default function Play() {
  const { quiz, sevenIronCarry, readiness, loading } = useUserData()
  const [checked, setChecked] = useState<Set<number>>(new Set())

  const golfIQ = quiz?.golfIQ ?? null
  const rec = getCourseRecommendation(sevenIronCarry)
  const isCertified = golfIQ !== null && golfIQ >= 40

  function toggleCheck(i: number) {
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <div className="px-5 pt-10 pb-4 max-w-lg mx-auto">
      <h1 className="font-sans font-semibold text-2xl text-ryp-black tracking-tight mb-1">Play</h1>
      <p className="text-sm text-ryp-mid mb-7">Your readiness snapshot before heading to the course.</p>

      {/* Loop Certified card */}
      <div className={`rounded-2xl px-6 py-6 mb-5 ${isCertified ? 'bg-ryp-black' : 'bg-black/5 border border-black/10'}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`text-[10px] font-medium tracking-widest uppercase mb-1 ${isCertified ? 'text-ryp-green' : 'text-ryp-mid'}`}>
              {isCertified ? 'Status' : 'Complete the quiz to unlock'}
            </p>
            <p className={`font-sans font-semibold text-xl ${isCertified ? 'text-white' : 'text-ryp-mid'}`}>
              {isCertified ? 'Loop Certified ✓' : 'Not certified yet'}
            </p>
            {golfIQ !== null && (
              <p className={`text-sm mt-1 ${isCertified ? 'text-white/60' : 'text-ryp-mid'}`}>
                Golf IQ: {golfIQ}
              </p>
            )}
          </div>
          {isCertified && (
            <div className="w-14 h-14 rounded-full bg-ryp-green flex items-center justify-center shrink-0">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M6 14l5.5 5.5 10.5-11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Readiness breakdown */}
      {readiness && (
        <div className="bg-white border border-black/8 rounded-2xl px-5 py-5 mb-5">
          <p className="text-[10px] font-medium tracking-widest uppercase text-ryp-mid mb-4">Readiness breakdown</p>
          {([
            ['Distance', readiness.distanceReadiness],
            ['Consistency', readiness.consistencyReadiness],
            ['Knowledge', readiness.knowledgeReadiness],
          ] as [string, number][]).map(([label, score]) => (
            <div key={label} className="mb-3 last:mb-0">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-ryp-black">{label}</span>
                <span className="text-xs text-ryp-mid">{score}%</span>
              </div>
              <div className="h-1.5 bg-black/8 rounded-full overflow-hidden">
                <div
                  className="h-full bg-ryp-green rounded-full transition-all"
                  style={{ width: `${Math.min(score, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course recommendation */}
      <div className="bg-white border border-black/8 rounded-2xl px-5 py-5 mb-5">
        <p className="text-[10px] font-medium tracking-widest uppercase text-ryp-mid mb-3">Recommended course</p>
        {loading ? (
          <div className="h-1.5 bg-black/8 rounded-full animate-pulse" />
        ) : rec ? (
          <>
            <p className="font-sans font-semibold text-base text-ryp-black mb-0.5">{rec.type}</p>
            <p className="text-sm text-ryp-green font-medium mb-2">{rec.yardage}</p>
            <p className="text-xs text-ryp-mid leading-relaxed">{rec.desc}</p>
          </>
        ) : (
          <p className="text-sm text-ryp-mid">Upload a Practice session to get your course recommendation based on 7-iron carry distance.</p>
        )}
      </div>

      {/* Pre-round checklist */}
      <div className="bg-white border border-black/8 rounded-2xl px-5 py-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-medium tracking-widest uppercase text-ryp-mid">Before you tee off</p>
          <span className="text-xs text-ryp-mid">{checked.size} / {PRE_ROUND_CHECKLIST.length}</span>
        </div>
        <div className="flex flex-col gap-3">
          {PRE_ROUND_CHECKLIST.map((item, i) => (
            <button
              key={i}
              onClick={() => toggleCheck(i)}
              className="flex items-start gap-3 text-left"
            >
              <div className={`w-5 h-5 rounded shrink-0 mt-0.5 flex items-center justify-center border transition-colors ${
                checked.has(i) ? 'bg-ryp-green border-ryp-green' : 'border-black/20'
              }`}>
                {checked.has(i) && (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M2 5.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className={`text-sm leading-snug ${checked.has(i) ? 'line-through text-ryp-mid' : 'text-ryp-black'}`}>
                {item}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
