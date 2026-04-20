import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../utils/authHelpers'
import { LoopLogo } from '../components/LoopLogo'

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      await signUp(email, password)
      navigate('/onboarding')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign up failed'
      setError(friendlyError(msg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ryp-off-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-white border border-black/8 rounded-lg px-8 py-10">

          <div className="flex justify-center mb-8">
            <LoopLogo width={120} />
          </div>

          <h2 className="font-sans font-medium text-2xl text-ryp-black mb-1">
            Start your loop
          </h2>
          <p className="text-sm text-ryp-mid mb-8">
            Create an account to get Loop certified.
          </p>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[11px] font-medium tracking-widest uppercase text-ryp-mid">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-black/12 rounded bg-ryp-off-white focus:outline-none focus:border-ryp-green focus:ring-1 focus:ring-ryp-green transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-[11px] font-medium tracking-widest uppercase text-ryp-mid">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-black/12 rounded bg-ryp-off-white focus:outline-none focus:border-ryp-green focus:ring-1 focus:ring-ryp-green transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirm" className="text-[11px] font-medium tracking-widest uppercase text-ryp-mid">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-black/12 rounded bg-ryp-off-white focus:outline-none focus:border-ryp-green focus:ring-1 focus:ring-ryp-green transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 bg-ryp-green text-white font-medium text-sm tracking-wide rounded hover:bg-ryp-green-dark disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ryp-mid mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-ryp-black font-medium underline underline-offset-2 hover:text-ryp-green transition-colors">
            Log in
          </Link>
        </p>

      </div>
    </div>
  )
}

function friendlyError(msg: string): string {
  if (msg.includes('email-already-in-use'))
    return 'An account with this email already exists.'
  if (msg.includes('invalid-email'))
    return 'Please enter a valid email address.'
  if (msg.includes('weak-password'))
    return 'Password must be at least 6 characters.'
  if (msg.includes('network'))
    return 'Network error. Check your connection.'
  return 'Something went wrong. Try again.'
}
