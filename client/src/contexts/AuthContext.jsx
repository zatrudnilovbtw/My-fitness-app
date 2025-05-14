import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Проверяем авторизацию при загрузке компонента
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5001/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setCurrentUser(data.user);
          setIsAuthenticated(true);
        } else {
          // Если токен невалидный, удаляем его
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Вход пользователя
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при входе');
      }

      localStorage.setItem('token', data.token);
      setCurrentUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Регистрация пользователя
  const register = async (name, email, password) => {
    try {
      // Проверяем, что все поля заполнены
      if (!name || !email || !password) {
        return { 
          success: false, 
          message: 'Все поля обязательны для заполнения' 
        };
      }
      
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      
      // Проверяем тип контента ответа
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        // Только если ответ действительно в формате JSON, пытаемся его разобрать
        data = await response.json();
      } else {
        // Если ответ не JSON, получаем текст ответа для диагностики
        const textResponse = await response.text();
        console.error('Сервер вернул не JSON-ответ:', textResponse);
        return { 
          success: false, 
          message: 'Сервер вернул некорректный формат ответа. Попробуйте позже.' 
        };
      }

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при регистрации');
      }

      return { success: true, message: data.message || 'Регистрация успешна' };
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      return { 
        success: false, 
        message: error.message || 'Ошибка при регистрации. Попробуйте позже.'
      };
    }
  };

  // Выход пользователя
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 