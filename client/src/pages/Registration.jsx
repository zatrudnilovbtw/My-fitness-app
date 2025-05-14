import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/Registration.css'

const Registration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register, login } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Проверка соответствия паролей
    if (formData.password !== formData.confirmPassword) {
      return setError('Пароли не совпадают')
    }
    
    // Проверка длины пароля
    if (formData.password.length < 6) {
      return setError('Пароль должен быть не менее 6 символов')
    }

    setLoading(true)
    
    // Регистрация пользователя
    const registerResult = await register(formData.name, formData.email, formData.password)
    
    if (registerResult.success) {
      // После успешной регистрации сразу выполняем вход
      const loginResult = await login(formData.email, formData.password)
      
      if (loginResult.success) {
        // После успешного входа перенаправляем на главную страницу
        navigate('/')
      } else {
        // Если вход не удался, показываем ошибку
        setError(loginResult.message || 'Регистрация успешна, но вход не удался. Пожалуйста, войдите вручную.')
        navigate('/login')
      }
    } else {
      setError(registerResult.message)
    }
    
    setLoading(false)
  }

  return (
    <div className="registration-container">
      <div className="registration-form">
        <h2>Создайте аккаунт</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Имя</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Регистрация...' : 'Создать аккаунт'}
          </button>
        </form>
        
        <div className="login-link">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </div>
    </div>
  )
}

export default Registration