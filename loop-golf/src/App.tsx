import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Onboarding from './pages/Onboarding'
import Quiz from './pages/Quiz'

// Placeholder — will be replaced when each module is built
function ComingSoon({ label }: { label: string }) {
  return (
    <div className="min-h-screen bg-ryp-off-white flex items-center justify-center">
      <p className="font-sans text-ryp-mid text-sm">{label} — coming soon</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/"            element={<Landing />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/signup"          element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected — placeholders until modules are built */}
          <Route path="/onboarding"  element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/quiz"        element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
          <Route path="/learn"       element={<ProtectedRoute><ComingSoon label="Learn" /></ProtectedRoute>} />
          <Route path="/practice"    element={<ProtectedRoute><ComingSoon label="Practice" /></ProtectedRoute>} />
          <Route path="/plan"        element={<ProtectedRoute><ComingSoon label="Plan" /></ProtectedRoute>} />
          <Route path="/dashboard"   element={<ProtectedRoute><ComingSoon label="Dashboard" /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
