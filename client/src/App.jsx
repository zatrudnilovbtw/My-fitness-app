import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Stats from './pages/Stats'
import Profile from './pages/Profile'
import Psychological from './pages/Psychological'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import RedirectHandler from './components/RedirectHandler'
import { useAuth } from './contexts/AuthContext'
import './styles/App.css'
import './styles/Loading.css'

function App() {
  const { isAuthenticated, loading } = useAuth();

  // Если идет проверка авторизации, показываем экран загрузки
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <span>Загрузка...</span>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Показываем Header только для авторизованных пользователей */}
      <Header />
      
      <main className="content">
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Registration />
            </PublicRoute>
          } />

          {/* Защищенные маршруты */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/stats" element={
            <ProtectedRoute>
              <Stats />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/psychological" element={
            <ProtectedRoute>
              <Psychological />
            </ProtectedRoute>
          } />
          
          {/* Обработчик перенаправления для корневого маршрута */}
          <Route path="/" element={<RedirectHandler />} />
          
          {/* Перенаправляем все неизвестные маршруты в зависимости от состояния авторизации */}
          <Route path="*" element={
            isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />
          } />
        </Routes>
      </main>
    </div>
  )
}

export default App
