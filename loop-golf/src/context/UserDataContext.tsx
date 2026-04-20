import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import {
  getProfile,
  getQuizResult,
  getLatestMetrics,
  getLatestReadinessScore,
  getSessions,
} from '../utils/firestoreHelpers'
import type { UserProfile, QuizResult, ClubMetric, ReadinessScore } from '../utils/firestoreHelpers'

interface UserDataContextType {
  profile: UserProfile | null
  quiz: QuizResult | null
  metrics: ClubMetric[]
  readiness: ReadinessScore | null
  sevenIronCarry: number | null
  loading: boolean
  refresh: () => void
}

const UserDataContext = createContext<UserDataContextType>({
  profile: null,
  quiz: null,
  metrics: [],
  readiness: null,
  sevenIronCarry: null,
  loading: true,
  refresh: () => {},
})

export function UserDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [profile, setProfile]     = useState<UserProfile | null>(null)
  const [quiz, setQuiz]           = useState<QuizResult | null>(null)
  const [metrics, setMetrics]     = useState<ClubMetric[]>([])
  const [readiness, setReadiness] = useState<ReadinessScore | null>(null)
  const [sevenIronCarry, setSevenIronCarry] = useState<number | null>(null)
  const [loading, setLoading]     = useState(true)

  const load = useCallback(() => {
    if (!user) { setLoading(false); return }
    setLoading(true)
    Promise.all([
      getProfile(user.uid),
      getQuizResult(user.uid),
      getLatestMetrics(user.uid),
      getLatestReadinessScore(user.uid),
      getSessions(user.uid),
    ]).then(([p, q, m, r, sessions]) => {
      setProfile(p)
      setQuiz(q)
      setMetrics(m)
      setReadiness(r)
      // Use explicitly stored sevenIronCarry from most recent session
      const carry = sessions.find(s => s.sevenIronCarry != null)?.sevenIronCarry ?? null
      setSevenIronCarry(carry)
      setLoading(false)
    }).catch((err) => {
      console.error('Failed to load user data:', err)
      setLoading(false)
    })
  }, [user])

  useEffect(() => { load() }, [load])

  return (
    <UserDataContext.Provider value={{ profile, quiz, metrics, readiness, sevenIronCarry, loading, refresh: load }}>
      {children}
    </UserDataContext.Provider>
  )
}

export const useUserData = () => useContext(UserDataContext)
