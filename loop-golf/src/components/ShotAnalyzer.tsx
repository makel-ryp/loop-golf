import { useRef, useState } from 'react'
import { parseGSProCSV, type ShotRecord } from '../utils/csvParser'
import { analyzeShots, getSevenIronCarry, type ClubSummary } from '../utils/shotAnalyzer'
import { calcReadiness, readinessLabel, recommendCourseLength } from '../utils/scoringEngine'
import { saveSession } from '../utils/firestoreHelpers'
import { ShotDispersionChart } from './ShotDispersionChart'

interface ShotAnalyzerProps {
  userId: string
  knowledgeScore?: number       // 0–30 from the quiz
  onSaved?: (sessionId: string) => void
}

export function ShotAnalyzer({ userId, knowledgeScore = 0, onSaved }: ShotAnalyzerProps) {
  const fileRef  = useRef<HTMLInputElement>(null)
  const [shots, setShots]         = useState<ShotRecord[]>([])
  const [summaries, setSummaries] = useState<ClubSummary[]>([])
  const [fileName, setFileName]   = useState('')
  const [error, setError]         = useState('')
  const [saving, setSaving]       = useState(false)
  const [savedId, setSavedId]     = useState<string | null>(null)
  const [dragging, setDragging]   = useState(false)

  const sevenIronCarry = summaries.length > 0 ? getSevenIronCarry(summaries) : null
  const readiness      = summaries.length > 0 ? calcReadiness(summaries, knowledgeScore) : null
  const courseRec      = sevenIronCarry != null ? recommendCourseLength(sevenIronCarry) : null

  async function processFile(file: File) {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a .csv file exported from GSPro.')
      return
    }
    setError('')
    setSavedId(null)
    setFileName(file.name)
    try {
      const parsed = await parseGSProCSV(file)
      setShots(parsed)
      setSummaries(analyzeShots(parsed))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file.')
      setSummaries([])
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    // only clear when leaving the zone itself, not a child element
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragging(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  async function handleSave() {
    if (!summaries.length) return
    setSaving(true)
    setError('')
    try {
      const id = await saveSession(userId, summaries, sevenIronCarry)
      setSavedId(id)
      onSaved?.(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const consistencyColor = (stdDev: number) =>
    stdDev <= 8 ? 'text-ryp-green' : stdDev <= 15 ? 'text-amber-500' : 'text-red-500'

  const maxCarry = summaries.length > 0 ? Math.max(...summaries.map((s) => s.avgCarry)) : 1

  return (
    <div className="space-y-6">

      {/* Upload drop zone */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all select-none ${
          dragging
            ? 'border-ryp-green bg-ryp-green-tint scale-[1.01]'
            : 'border-black/12 hover:border-ryp-green hover:bg-ryp-off-white'
        }`}
      >
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
        <p className={`text-3xl mb-3 transition-transform ${dragging ? 'scale-125' : ''}`}>
          {dragging ? '📂' : fileName ? '✅' : '⛳'}
        </p>
        <p className="font-sans font-medium text-ryp-black text-sm">
          {dragging
            ? 'Drop it!'
            : fileName
            ? fileName
            : 'Drop your GSPro export here'}
        </p>
        <p className="text-xs text-ryp-mid mt-1">
          {dragging ? '' : 'or click to browse  ·  .csv files only'}
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Shot dispersion chart */}
      {shots.length > 0 && (
        <div>
          <p className="text-[11px] font-medium tracking-widest uppercase text-ryp-mid mb-2">
            Shot Dispersion
          </p>
          <ShotDispersionChart shots={shots} />
        </div>
      )}

      {/* Readiness + course rec cards */}
      {readiness && courseRec && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-ryp-green-tint border border-ryp-green/20 rounded-lg p-4">
            <p className="text-[11px] font-medium tracking-widest uppercase text-ryp-mid mb-1">
              Readiness Score
            </p>
            <p className="font-serif text-4xl text-ryp-green-deep">
              {readiness.overallScore}
              <span className="text-base font-sans font-normal text-ryp-mid">/100</span>
            </p>
            <p className="text-xs font-medium text-ryp-green mt-1">
              {readinessLabel(readiness.overallScore)}
            </p>
            <div className="mt-3 space-y-1">
              {[
                { label: 'Distance',    val: readiness.distanceScore,    max: 40 },
                { label: 'Consistency', val: readiness.consistencyScore, max: 30 },
                { label: 'Knowledge',   val: readiness.knowledgeScore,   max: 30 },
              ].map(({ label, val, max }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-ryp-mid">{label}</span>
                  <span className="font-medium text-ryp-black">{val}/{max}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-black/8 rounded-lg p-4">
            <p className="text-[11px] font-medium tracking-widest uppercase text-ryp-mid mb-1">
              Recommended Tees
            </p>
            <p className="font-serif text-xl text-ryp-black leading-tight">
              {courseRec.teeLabel}
            </p>
            <p className="text-xs text-ryp-mid mt-1">
              {courseRec.minYards.toLocaleString()}–{courseRec.maxYards.toLocaleString()} yds
            </p>
            <p className="text-xs text-ryp-mid mt-2 leading-relaxed">
              {courseRec.rationale}
            </p>
          </div>
        </div>
      )}

      {/* Club stats table */}
      {summaries.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-black/8">
          <table className="w-full text-sm">
            <thead className="bg-ryp-off-white text-ryp-mid text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Club</th>
                <th className="px-4 py-3 text-right">Shots</th>
                <th className="px-4 py-3 text-right">Avg Carry</th>
                <th className="px-4 py-3 text-right">Ball Speed</th>
                <th className="px-4 py-3 text-right">Launch</th>
                <th className="px-4 py-3 text-right">Miss</th>
                <th className="px-4 py-3 text-right">Consistency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/6">
              {summaries.map((s) => (
                <tr key={s.club} className="hover:bg-ryp-off-white/50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-ryp-black">{s.displayName}</span>
                    <span className="ml-2 text-[11px] text-ryp-mid">{s.club}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-ryp-mid">{s.shots}</td>
                  <td className="px-4 py-3 text-right font-medium text-ryp-black">{s.avgCarry} yds</td>
                  <td className="px-4 py-3 text-right text-ryp-mid">{s.avgBallSpeed} mph</td>
                  <td className="px-4 py-3 text-right text-ryp-mid">{s.avgLaunchAngle}°</td>
                  <td className="px-4 py-3 text-right text-ryp-mid">
                    {s.missDirection === 'straight'
                      ? '—'
                      : `${s.avgMissYards} yds ${s.missDirection}`}
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${consistencyColor(s.carryStdDev)}`}>
                    ±{s.carryStdDev} yds
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Carry distance bar chart */}
      {summaries.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-medium tracking-widest uppercase text-ryp-mid">
            Carry Distance by Club
          </p>
          {summaries.map((s) => (
            <div key={s.club} className="flex items-center gap-3">
              <span className="text-xs text-ryp-mid w-28 text-right shrink-0">{s.displayName}</span>
              <div className="flex-1 bg-black/6 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-ryp-green rounded-full transition-all"
                  style={{ width: `${(s.avgCarry / maxCarry) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-ryp-black w-14 shrink-0 text-right">
                {s.avgCarry} yds
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Save button */}
      {summaries.length > 0 && (
        <button
          onClick={handleSave}
          disabled={saving || !!savedId}
          className="w-full py-3 bg-ryp-green text-white font-sans font-medium text-sm rounded hover:bg-ryp-green-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {savedId ? 'Saved to profile ✓' : saving ? 'Saving…' : 'Save to my profile'}
        </button>
      )}
    </div>
  )
}
