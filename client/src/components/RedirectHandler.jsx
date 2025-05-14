import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Компонент для перенаправления на нужную страницу в зависимости от состояния авторизации
const RedirectHandler = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Если авторизован, перенаправляем на главную
      if (isAuthenticated) {
        navigate('/');
      } else {
        // Если не авторизован, перенаправляем на страницу входа
        navigate('/login');
      }
    }
  }, [isAuthenticated, loading, navigate]);

  // Во время загрузки показываем пустой экран
  return null;
};

export default RedirectHandler; 