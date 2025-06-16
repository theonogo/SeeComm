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
import Tutorial from './pages/Tutorial.tsx';
import Upload from './pages/Upload.tsx';
import { TutorialsProvider } from './utils/TutorialsContext.tsx';


export default function App() {

  return (
    <StrictMode>
      <AuthProvider>
        <ThemeProvider>
          <TutorialsProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>} >
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
                <Route path="/tutorial/:id" element={<ProtectedRoute><Tutorial /></ProtectedRoute>} />
              </Route>
            </Routes>
          </Router>
          </TutorialsProvider>
        </ThemeProvider>
      </AuthProvider>
  </StrictMode>
  )
}

