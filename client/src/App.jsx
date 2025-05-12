import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ActivityMonitoring from './pages/ActivityMonitoring'
import Stats from './pages/Stats'
import Profile from './pages/Profile'
import Psychological from './pages/Psychological'
import Header from './components/Header'
import './styles/App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/activity" element={<ActivityMonitoring />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/psychological" element={<Psychological />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
