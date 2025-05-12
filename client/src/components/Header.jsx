import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/Header.css'

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="header">
      <div className="header-logo">
        <h1 >Фитнес-трекер</h1>
      </div>
      <nav className="header-nav">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Главная
        </Link>
        <Link to="/activity" className={location.pathname === '/activity' ? 'active' : ''}>
          Активность
        </Link>
        <Link to="/stats" className={location.pathname === '/stats' ? 'active' : ''}>
          Статистика
        </Link>
        <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
          Профиль
        </Link>
        <Link to="/psychological" className={location.pathname === '/psychological' ? 'active' : ''}>
          Опросники
        </Link>
      </nav>
  
    </header>
  )
}

export default Header