import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { saveProfile, type GolfGoal } from '../utils/firestoreHelpers'
import { LoopLogo } from '../components/LoopLogo'

const GOALS: { value: GolfGoal; label: string }[] = [
  { value: 'play_first_round',  label: 'Play my first round' },
  { value: 'break_100',         label: 'Break 100' },
  { value: 'break_90',          label: 'Break 90' },
  { value: 'play_with_others',  label: 'Play with friends or family' },
  { value: 'get_handicap',      label: 'Get an official handicap' },
  { value: 'join_league',       label: 'Join a league' },
  { value: 'just_for_fun',      label: 'Just for fun' },
]

const STEPS = ['About you', 'Experience', 'Your game', 'Goals']

export default function Onboarding() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [error, setError]     = useState<string | null>(null)
  const [saving, setSaving]   = useState(false)

  // Step 0 — About you
  const [name, setName] = useState('')
  const [age, setAge]   = useState('')

  // Step 1 — Experience
  const [yearsExperience, setYearsExperience] = useState('')
  const [golfLevel, setGolfLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')

  // Step 2 — Your game
  const [handicap, setHandicap]               = useState('')
  const [hasHandicap, setHasHandicap]         = useState(false)
  const [drivingDist, setDrivingDist]         = useState('')
  const [knowsDriving, setKnowsDriving]       = useState(false)

  // Step 3 — Goals
  const [goals, setGoals] = useState<GolfGoal[]>([])

  function toggleGoal(g: GolfGoal) {
    setGoals((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    )
  }

  function validateStep(): string | null {
    if (step === 0) {
      if (!name.trim()) return 'Name is required.'
      if (!age || parseInt(age) < 5 || parseInt(age) > 120) return 'Enter a valid age.'
    }
    if (step === 1) {
      if (yearsExperience === '') return 'Please enter your years of experience.'
    }
    if (step === 3) {
      if (!goals.length) return 'Pick at least one goal.'
    }
    return null
  }

  function next() {
    const err = validateStep()
    if (err) { setError(err); return }
    setError(null)
    setStep((s) => s + 1)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const err = validateStep()
    if (err) { setError(err); return }
    if (!user) return

    setSaving(true)
    try {
      await saveProfile(user.uid, {
        name:                     name.trim(),
        age:                      parseInt(age),
        golfLevel,
        yearsExperience:          parseInt(yearsExperience) || 0,
        handicap:                 hasHandicap && handicap ? parseFloat(handicap) : null,
        projectedDrivingDistance: knowsDriving && drivingDist ? parseInt(drivingDist) : null,
        goals,
      })
      navigate('/quiz')
    } catch (err) {
      console.error('Save profile error:', err)
      setError('Failed to save profile. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-ryp-off-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <LoopLogo width={100} />
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-medium transition-colors ${
                i < step  ? 'bg-ryp-green text-white' :
                i === step ? 'bg-ryp-black text-white' :
                             'bg-black/10 text-ryp-mid'
              }`}>
                {i < step ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : i + 1}
              </div>
              <span className={`text-[11px] font-medium tracking-wide hidden sm:block ${i === step ? 'text-ryp-black' : 'text-ryp-mid'}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`h-px flex-1 ${i < step ? 'bg-ryp-green' : 'bg-black/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white border border-black/8 rounded-lg px-8 py-10">

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* ── Step 0: About you ── */}
            {step === 0 && (
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="font-sans font-medium text-2xl text-ryp-black mb-1">About you</h2>
                  <p className="text-sm text-ryp-mid">Let's get to know you.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium tracking-widest uppercase text-ryp-mid">Name</label>
                  <input
                    type="text"
                    autoComplete="given-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="First name"
                    className="w-full px-3.5 py-2.5 text-sm border border-black/12 rounded bg-ryp-off-white focus:outline-none focus:border-ryp-green focus:ring-1 focus:ring-ryp-green transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium tracking-widest uppercase text-ryp-mid">Age</label>
                  <input
                    type="number"
                    min={5}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 28"
                    className="w-full px-3.5 py-2.5 text-sm border border-black/12 rounded bg-ryp-off-white focus:outline-none focus:border-ryp-green focus:ring-1 focus:ring-ryp-green transition-colors"
                  />
                </div>
              </div>
            )}

            {/* ── Step 1: Experience ── */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="font-sans font-medium text-2xl text-ryp-black mb-1">Your experience</h2>
                  <p className="text-sm text-ryp-mid">Honest answers make better recommendations.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium tracking-widest uppercase text-ryp-mid">Years playing golf</label>
                  <input
                    type="number"
                    min={0}
                    max={80}
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    placeholder="0 = just starting"
                    className="w-full px-3.5 py-2.5 text-sm border border-black/12 rounded bg-ryp-off-white focus:outline-none focus:border-ryp-green focus:ring-1 focus:ring-ryp-green transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-medium tracking-widest uppercase text-ryp-mid">How would you describe your level?</label>
                  {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setGolfLevel(level)}
                      className={`flex items-center justify-between px-4 py-3 rounded border text-sm font-medium transition-colors ${
                        golfLevel === level
                          ? 'border-ryp-green bg-ryp-green-tint text-ryp-green-deep'
                          : 'border-black/12 bg-ryp-off-white text-ryp-black hover:border-ryp-black'
                      }`}
                    >
                      <span className="capitalize">{level}</span>
                      {golfLevel === level && (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 7l3.5 3.5 6.5-7" stroke="#00AF51" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 2: Your game ── */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="font-sans font-medium text-2xl text-ryp-black mb-1">Your game</h2>
                  <p className="text-sm text-ryp-mid">Both fields are optional — skip if you're not sure yet.</p>
                </div>

                {/* Handicap */}
                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-medium tracking-widest uppercase text-ryp-mid">Handicap index</label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasHandicap}
                      onChange={(e) => setHasHandicap(e.target.checked)}
                      className="w-4 h-4 rounded accent-ryp-green"
                    />
                    <span className="text-sm text-ryp-black">I have an official handicap</span>
                  </label>
                  {hasHandicap && (
                    <input
                      type="number"
                      min={0}
                      max={54}
                      step={0.1}
                      value={handicap}
                      onChange={(e) => setHandicap(e.target.value)}
                      placeholder="e.g. 18.4"
                      className="w-full px-3.5 py-2.5 text-sm border border-black/12 rounded bg-ryp-off-white focus:outline-none focus:border-ryp-green focus:ring-1 focus:ring-ryp-green transition-colors"
                    />
                  )}
                </div>

                {/* Driving distance */}
                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-medium tracking-widest uppercase text-ryp-mid">Projected driving distance</label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={knowsDriving}
                      onChange={(e) => setKnowsDriving(e.target.checked)}
                      className="w-4 h-4 rounded accent-ryp-green"
                    />
                    <span className="text-sm text-ryp-black">I know my approximate driver distance</span>
                  </label>
                  {knowsDriving && (
                    <div className="relative">
                      <input
                        type="number"
                        min={50}
                        max={400}
                        value={drivingDist}
                        onChange={(e) => setDrivingDist(e.target.value)}
                        placeholder="e.g. 220"
                        className="w-full px-3.5 py-2.5 pr-12 text-sm border border-black/12 rounded bg-ryp-off-white focus:outline-none focus:border-ryp-green focus:ring-1 focus:ring-ryp-green transition-colors"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-ryp-mid">yds</span>
                    </div>
                  )}
                  <p className="text-xs text-ryp-mid">No worries if not — the Practice module will figure this out from your GSPRO data.</p>
                </div>
              </div>
            )}

            {/* ── Step 3: Goals ── */}
            {step === 3 && (
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="font-sans font-medium text-2xl text-ryp-black mb-1">What's the goal?</h2>
                  <p className="text-sm text-ryp-mid">Pick everything that applies.</p>
                </div>

                <div className="flex flex-col gap-2">
                  {GOALS.map(({ value, label }) => {
                    const selected = goals.includes(value)
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => toggleGoal(value)}
                        className={`flex items-center justify-between px-4 py-3 rounded border text-sm font-medium transition-colors ${
                          selected
                            ? 'border-ryp-green bg-ryp-green-tint text-ryp-green-deep'
                            : 'border-black/12 bg-ryp-off-white text-ryp-black hover:border-ryp-black'
                        }`}
                      >
                        <span>{label}</span>
                        {selected && (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 7l3.5 3.5 6.5-7" stroke="#00AF51" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => { setError(null); setStep((s) => s - 1) }}
                  className="flex-1 py-3 border border-black/12 text-ryp-black font-medium text-sm rounded hover:border-ryp-black transition-colors"
                >
                  Back
                </button>
              )}

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  className="flex-1 py-3 bg-ryp-green text-white font-medium text-sm rounded hover:bg-ryp-green-dark transition-colors"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-ryp-green text-white font-medium text-sm rounded hover:bg-ryp-green-dark disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Saving…' : "Let's go"}
                </button>
              )}
            </div>

          </form>
        </div>

      </div>
    </div>
  )
}
