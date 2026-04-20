import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UserDataProvider } from './context/UserDataContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Onboarding from './pages/Onboarding'
import Quiz from './pages/Quiz'
import Learn from './pages/Learn'
import Glossary from './pages/Glossary'
import Practice from './pages/Practice'
import Play from './pages/Play'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import ModuleQuiz from './pages/ModuleQuiz'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/"                element={<Landing />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/signup"          element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/onboarding"      element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/quiz"            element={<ProtectedRoute><Quiz /></ProtectedRoute>} />

          {/* Main app — tabbed layout */}
          <Route element={<ProtectedRoute><UserDataProvider><AppLayout /></UserDataProvider></ProtectedRoute>}>
            <Route path="/learn"                    element={<Learn />} />
            <Route path="/learn/module/:id"        element={<ModuleQuiz />} />
            <Route path="/glossary"  element={<Glossary />} />
            <Route path="/practice"  element={<Practice />} />
            <Route path="/play"      element={<Play />} />
            <Route path="/chat"      element={<Chat />} />
            <Route path="/profile"   element={<Profile />} />
          </Route>

          {/* Legacy redirects */}
          <Route path="/dashboard" element={<Navigate to="/learn" replace />} />
          <Route path="/plan"      element={<Navigate to="/play" replace />} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
