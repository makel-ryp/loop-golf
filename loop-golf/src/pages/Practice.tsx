import { useAuth } from '../context/AuthContext'
import { ShotAnalyzer } from '../components/ShotAnalyzer'

export default function Practice() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <div className="px-5 pt-10 pb-4 max-w-lg mx-auto">
      <h1 className="font-sans font-semibold text-2xl text-ryp-black tracking-tight mb-1">Practice</h1>
      <p className="text-sm text-ryp-mid mb-7">
        Upload a GSPro session to see your club distances, consistency, and course readiness.
      </p>
      <ShotAnalyzer userId={user.uid} />
    </div>
  )
}
