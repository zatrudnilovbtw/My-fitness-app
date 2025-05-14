import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/Profile.css'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: ''
  })

  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()

  // Получение данных пользователя при загрузке компонента
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        navigate('/login')
        return
      }

      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:5001/api/users/${currentUser.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Ошибка при получении данных пользователя')
        }

        setUser(data.user)
        setFormData({
          name: data.user.name || '',
          age: data.user.age || '',
          gender: data.user.gender || ''
        })
      } catch (err) {
        console.error('Ошибка:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [currentUser, navigate])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`http://localhost:5001/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при обновлении профиля')
      }

      setUser({...user, ...formData})
      setIsEditing(false)
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err)
      setError(err.message)
    }
  }

  if (loading) {
    return <div className="profile-loading">Загрузка...</div>
  }

  if (!user && !loading) {
    return <div className="profile-error">Пользователь не найден. <button onClick={() => navigate('/login')}>Войти</button></div>
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Мой профиль</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Имя</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="age">Возраст</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="gender">Пол</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Выберите пол</option>
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
                <option value="other">Другой</option>
              </select>
            </div>
            
            <div className="profile-buttons">
              <button type="submit" className="save-button">Сохранить</button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => {
                  setFormData({
                    name: user.name || '',
                    age: user.age || '',
                    gender: user.gender || ''
                  });
                  setIsEditing(false);
                }}
              >
                Отмена
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">Имя:</span>
              <span className="info-value">{user.name || 'Не указано'}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">Возраст:</span>
              <span className="info-value">{user.age || 'Не указан'}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">Пол:</span>
              <span className="info-value">
                {user.gender === 'male' ? 'Мужской' : 
                 user.gender === 'female' ? 'Женский' : 
                 user.gender === 'other' ? 'Другой' : 'Не указан'}
              </span>
            </div>
            
            <div className="profile-buttons">
              <button onClick={() => setIsEditing(true)} className="edit-button">
                Редактировать профиль
              </button>
              <button onClick={handleLogout} className="logout-button">
                Выйти из аккаунта
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="activity-history">
        <h3>История активности</h3>
        <p className="no-history">История активности будет отображаться здесь</p>
        {/* Здесь будет таблица с историей активности */}
      </div>
    </div>
  )
}

export default Profile