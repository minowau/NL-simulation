import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Simulator from './pages/Simulator'
import Profile from './pages/Profile'
import { LearningProvider } from './context/LearningContext'

function App() {
  return (
    <LearningProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/simulator" element={<Simulator />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </LearningProvider>
  )
}

export default App