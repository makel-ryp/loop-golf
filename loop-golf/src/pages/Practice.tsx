import { useAuth } from '../context/AuthContext'
import { ShotAnalyzer } from '../components/ShotAnalyzer'
import { LoopLogo } from '../components/LoopLogo'

export default function Practice() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <div className="min-h-screen bg-ryp-off-white px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-8">

        <div className="flex items-center justify-between">
          <LoopLogo width={72} />
        </div>

        <div>
          <h1 className="font-serif text-3xl text-ryp-black">Practice</h1>
          <p className="text-sm text-ryp-mid mt-1">
            Upload a GSPro session to see your club distances, consistency, and course readiness.
          </p>
        </div>

        <ShotAnalyzer userId={user.uid} />

      </div>
    </div>
  )
}
