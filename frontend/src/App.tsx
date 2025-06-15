import { StrictMode } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import Login from './pages/Login.tsx';
import { ProtectedRoute } from './auth/ProtectedRoute.tsx';
import { AuthProvider } from './auth/AuthContext.tsx';
import { PublicRoute } from './auth/PublicRoute.tsx';
import Home from './pages/Home.tsx';
import Layout from './layout.tsx';
import { ThemeProvider } from "@/components/ThemeProvider.tsx"


export default function App() {

  return (
    <StrictMode>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

              <Route element={<Layout />}>
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              </Route>
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthProvider>
  </StrictMode>
  )
}

