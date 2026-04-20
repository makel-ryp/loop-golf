import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp, signInWithGoogle } from '../utils/authHelpers'
import { LoopLogo } from '../components/LoopLogo'
import { getAdditionalUserInfo } from 'firebase/auth'

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  async function handleGoogle() {
    setError(null)
    setLoading(true)
    try {
      const result = await signInWithGoogle()
      const info = getAdditionalUserInfo(result)
      navigate(info?.isNewUser ? '/onboarding' : '/dashboard')
    } catch (err: unknown) {
      console.error('Google signup error:', err)
      const msg = err instanceof Error ? err.message : 'Google sign-in failed'
      setError(friendlyError(msg))
    } finally {
      setLoading(false)
    }
  }

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
      console.error('Signup error:', err)
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

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-black/10" />
            <span className="text-xs text-ryp-mid">or</span>
            <div className="flex-1 h-px bg-black/10" />
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full py-3 flex items-center justify-center gap-2.5 border border-black/12 rounded text-sm font-medium text-ryp-black hover:bg-ryp-off-white disabled:opacity-50 transition-colors"
          >
            <GoogleIcon />
            Continue with Google
          </button>
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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
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
  if (msg.includes('operation-not-allowed') || msg.includes('configuration-not-found'))
    return 'Auth not configured. Enable Email/Password in Firebase Console → Authentication → Sign-in method.'
  return `Something went wrong. Try again.`
}
