import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Members from './pages/Members'
import Rules from './pages/Rules'
import Deposits from './pages/Deposits'
import Expenses from './pages/Expenses'
import Events from './pages/Events'
import Summary from './pages/Summary'
import Settings from './pages/Settings'
import BottomNav from './components/BottomNav'
import { DataProvider } from './context/DataContext'
import './App.css'

function App() {
  return (
    <DataProvider>
      <Router basename="/meeting89">
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/members" element={<Members />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/deposits" element={<Deposits />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/events" element={<Events />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <BottomNav />
        </div>
      </Router>
    </DataProvider>
  )
}

export default App

