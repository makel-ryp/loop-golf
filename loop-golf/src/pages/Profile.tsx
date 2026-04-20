import { useState, useEffect, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { getProfile, saveProfile, getLatestMetrics, getSessions, type UserProfile, type GolfGoal } from '../utils/firestoreHelpers'

const GOALS: { value: GolfGoal; label: string }[] = [
  { value: 'play_first_round',  label: 'Play my first round' },
  { value: 'break_100',         label: 'Break 100' },
  { value: 'break_90',          label: 'Break 90' },
  { value: 'play_with_others',  label: 'Play with friends or family' },
  { value: 'get_handicap',      label: 'Get an official handicap' },
  { value: 'join_league',       label: 'Join a league' },
  { value: 'just_for_fun',      label: 'Just for fun' },
]

export default function Profile() {
  const { user } = useAuth()
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState('')

  // Profile form state
  const [name, setName]                       = useState('')
  const [age, setAge]                         = useState('')
  const [golfLevel, setGolfLevel]             = useState<'beginner'|'intermediate'|'advanced'>('beginner')
  const [yearsExperience, setYearsExperience] = useState('')
  const [hasHandicap, setHasHandicap]         = useState(false)
  const [handicap, setHandicap]               = useState('')
  const [knowsDriving, setKnowsDriving]       = useState(false)
  const [drivingDist, setDrivingDist]         = useState('')
  const [goals, setGoals]                     = useState<GolfGoal[]>([])

  // Data sections
  const [metrics, setMetrics]   = useState<Awaited<ReturnType<typeof getLatestMetrics>>>([])
  const [sessions, setSessions] = useState<Awaited<ReturnType<typeof getSessions>>>([])

  useEffect(() => {
    if (!user) return
    Promise.all([
      getProfile(user.uid),
      getLatestMetrics(user.uid),
      getSessions(user.uid),
    ]).then(([profile, m, s]) => {
      if (profile) {
        setName(profile.name ?? '')
        setAge(String(profile.age ?? ''))
        setGolfLevel(profile.golfLevel ?? 'beginner')
        setYearsExperience(String(profile.yearsExperience ?? ''))
        if (profile.handicap != null) { setHasHandicap(true); setHandicap(String(profile.handicap)) }
        if (profile.projectedDrivingDistance != null) { setKnowsDriving(true); setDrivingDist(String(profile.projectedDrivingDistance)) }
        setGoals(profile.goals ?? [])
      }
      setMetrics(m)
      setSessions(s)
    }).finally(() => setLoading(false))
  }, [user])

  function toggleGoal(g: GolfGoal) {
    setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    if (!name.trim()) { setError('Name is required.'); return }
    setSaving(true); setError(''); setSaved(false)
    try {
      const data: UserProfile = {
        name: name.trim(),
        age: parseInt(age) || 0,
        golfLevel,
        yearsExperience: parseInt(yearsExperience) || 0,
        handicap: hasHandicap && handicap ? parseFloat(handicap) : null,
        projectedDrivingDistance: knowsDriving && drivingDist ? parseInt(drivingDist) : null,
        goals,
      }
      await saveProfile(user.uid, data)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 rounded-full border-2 border-ryp-green border-t-transparent animate-spin" />
      </div>
    )
  }

  // Deduplicate metrics: keep the most recent entry per club
  const latestByClub = new Map<string, typeof metrics[number]>()
  for (const m of metrics) {
    if (!latestByClub.has(m.clubName)) latestByClub.set(m.clubName, m)
  }
  const clubRows = [...latestByClub.values()]

  return (
    <div className="px-5 pt-10 pb-8 max-w-lg mx-auto space-y-8">
      <div>
        <h1 className="font-sans font-semibold text-2xl text-ryp-black tracking-tight mb-1">Profile</h1>
        <p className="text-sm text-ryp-mid">Manage your preferences and review your data.</p>
      </div>

      {/* ── Edit Preferences ── */}
      <section>
        <p className="text-[11px] font-medium tracking-widest uppercase text-ryp-mid mb-3">Preferences</p>
        <div className="bg-white border border-black/8 rounded-lg px-6 py-6">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
          )}
          {saved && (
            <div className="mb-4 px-4 py-3 bg-ryp-green-tint border border-ryp-green/20 rounded text-sm text-ryp-green-deep">Saved!</div>
          )}
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium tracking-widest uppercase text-ryp-mid">Name</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  className="px-3.5 py-2.5 text-sm border border-black/12 rounded bg-ryp-off-white focus:outline-none focus:border-ryp-green focus:ring-1 focus:ring-ryp-green transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium tracking-widest uppercase text-ryp-mid">Age</label>
                <input
                  type="number" min={5} max={120} value={age} onChange={e => setAge(e.target.value)}
                  className="px-3.5 py-2.5 text-sm border border-black/12 rounded bg-ryp-off-white focus:outline-none focus:border-ryp-green focus:ring-1 focus:ring-ryp-green transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium tracking-widest uppercase text-ryp-mid">Level</label>
              <div className="flex gap-2">
                {(['beginner','intermediate','advanced'] as const).map(level => (
                  <button
                    key={level} type="button" onClick={() => setGolfLevel(level)}
                    className={`flex-1 py-2 rounded border text-xs font-medium transition-colors capitalize ${
                      golfLevel === level
                        ? 'border-ryp-green bg-ryp-green-tint text-ryp-green-deep'
                        : 'border-black/12 bg-ryp-off-white text-ryp-black'
                    }`}
                  >{level}</button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium tracking-widest uppercase text-ryp-mid">Years playing</label>
              <input
                type="number" min={0} max={80} value={yearsExperience} onChange={e => setYearsExperience(e.target.value)}
                placeholder="0 = just starting"
                className="px-3.5 py-2.5 text-sm border border-black/12 rounded bg-ryp-off-white focus:outline-none focus:border-ryp-green focus:ring-1 focus:ring-ryp-green transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={hasHandicap} onChange={e => setHasHandicap(e.target.checked)} className="w-4 h-4 rounded accent-ryp-green" />
                <span className="text-sm text-ryp-black">I have an official handicap</span>
              </label>
              {hasHandicap && (
                <input
                  type="number" min={0} max={54} step={0.1} value={handicap} onChange={e => setHandicap(e.target.value)}
                  placeholder="e.g. 18.4"
                  className="px-3.5 py-2.5 text-sm border border-black/12 rounded bg-ryp-off-white focus:outline-none focus:border-ryp-green focus:ring-1 focus:ring-ryp-green transition-colors"
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={knowsDriving} onChange={e => setKnowsDriving(e.target.checked)} className="w-4 h-4 rounded accent-ryp-green" />
                <span className="text-sm text-ryp-black">I know my driver distance</span>
              </label>
              {knowsDriving && (
                <div className="relative">
                  <input
                    type="number" min={50} max={400} value={drivingDist} onChange={e => setDrivingDist(e.target.value)}
                    placeholder="e.g. 220"
                    className="w-full px-3.5 py-2.5 pr-12 text-sm border border-black/12 rounded bg-ryp-off-white focus:outline-none focus:border-ryp-green focus:ring-1 focus:ring-ryp-green transition-colors"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-ryp-mid">yds</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium tracking-widest uppercase text-ryp-mid">Goals</label>
              <div className="grid grid-cols-1 gap-1.5">
                {GOALS.map(({ value, label }) => {
                  const sel = goals.includes(value)
                  return (
                    <button
                      key={value} type="button" onClick={() => toggleGoal(value)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded border text-sm font-medium transition-colors ${
                        sel ? 'border-ryp-green bg-ryp-green-tint text-ryp-green-deep' : 'border-black/12 bg-ryp-off-white text-ryp-black'
                      }`}
                    >
                      <span>{label}</span>
                      {sel && (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 7l3.5 3.5 6.5-7" stroke="#00AF51" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              type="submit" disabled={saving}
              className="w-full py-3 bg-ryp-green text-white font-sans font-medium text-sm rounded hover:bg-ryp-green-dark disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : 'Save preferences'}
            </button>
          </form>
        </div>
      </section>

      {/* ── Club Data ── */}
      {clubRows.length > 0 && (
        <section>
          <p className="text-[11px] font-medium tracking-widests uppercase text-ryp-mid mb-3">Club Data</p>
          <div className="overflow-x-auto rounded-lg border border-black/8">
            <table className="w-full text-sm">
              <thead className="bg-ryp-off-white text-ryp-mid text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Club</th>
                  <th className="px-4 py-3 text-right">Carry</th>
                  <th className="px-4 py-3 text-right">Ball Spd</th>
                  <th className="px-4 py-3 text-right">Miss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/6">
                {clubRows.map(m => (
                  <tr key={m.clubName} className="hover:bg-ryp-off-white/50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-ryp-black">{m.displayName}</span>
                      <span className="ml-1.5 text-[11px] text-ryp-mid">{m.clubName}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-ryp-black">{m.carryDistance} yds</td>
                    <td className="px-4 py-3 text-right text-ryp-mid">{m.ballSpeed} mph</td>
                    <td className="px-4 py-3 text-right text-ryp-mid">
                      {m.missDirection === 'straight' ? '—' : `${m.avgMissYards}y ${m.missDirection}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Upload History ── */}
      <section>
        <p className="text-[11px] font-medium tracking-widests uppercase text-ryp-mid mb-3">Upload History</p>
        {sessions.length === 0 ? (
          <div className="bg-white border border-black/8 rounded-lg px-6 py-8 text-center">
            <p className="text-sm text-ryp-mid">No sessions yet. Upload a GSPro CSV in the Practice tab.</p>
          </div>
        ) : (
          <div className="bg-white border border-black/8 rounded-lg divide-y divide-black/6">
            {sessions.map((s, i) => {
              const date = s.uploadDate?.toDate?.()
              const dateStr = date
                ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Unknown date'
              return (
                <div key={s.sessionId ?? i} className="flex items-center justify-between px-4 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-ryp-black">{dateStr}</p>
                    <p className="text-xs text-ryp-mid mt-0.5">{s.clubCount} club{s.clubCount !== 1 ? 's' : ''} tracked</p>
                  </div>
                  <div className="text-right">
                    {s.sevenIronCarry != null && (
                      <p className="text-sm font-medium text-ryp-black">{s.sevenIronCarry} yds</p>
                    )}
                    <p className="text-[11px] text-ryp-mid">{s.sevenIronCarry != null ? '7-iron carry' : ''}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
