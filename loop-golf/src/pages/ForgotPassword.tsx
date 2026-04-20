import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { resetPassword } from '../utils/authHelpers'
import { LoopLogo } from '../components/LoopLogo'

export default function ForgotPassword() {
  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('user-not-found') || msg.includes('invalid-email')) {
        // Don't reveal whether the email exists — just show success either way
        setSent(true)
      } else {
        setError('Something went wrong. Try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ryp-off-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="bg-white border border-black/8 rounded-lg px-8 py-10">

          <div className="flex justify-center mb-8">
            <LoopLogo width={120} />
          </div>

          {sent ? (
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-ryp-green-tint flex items-center justify-center mx-auto mb-4">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10l4 4 8-8" stroke="#00AF51" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="font-sans font-medium text-xl text-ryp-black mb-2">Check your email</h2>
              <p className="text-sm text-ryp-mid leading-relaxed">
                If an account exists for <span className="text-ryp-black font-medium">{email}</span>, you'll
                receive a reset link shortly.
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-sans font-medium text-2xl text-ryp-black mb-1">Reset password</h2>
              <p className="text-sm text-ryp-mid mb-8">
                Enter your email and we'll send a reset link.
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

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full py-3 bg-ryp-green text-white font-medium text-sm tracking-wide rounded hover:bg-ryp-green-dark disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-ryp-mid mt-6">
          <Link to="/login" className="text-ryp-black font-medium underline underline-offset-2 hover:text-ryp-green transition-colors">
            Back to log in
          </Link>
        </p>

      </div>
    </div>
  )
}
