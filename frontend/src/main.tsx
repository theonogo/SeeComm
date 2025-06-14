import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import Login from './Login.tsx';
import { ProtectedRoute } from './auth/ProtectedRoute.tsx';
import { AuthProvider } from './auth/AuthContext.tsx';
import { PublicRoute } from './auth/PublicRoute.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

          <Route path="/" element={<ProtectedRoute><App /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>,
)
