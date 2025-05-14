import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Компонент для публичных маршрутов, перенаправляющий авторизованных пользователей на главную
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Пока проверяем авторизацию, показываем загрузку
  if (loading) {
    return <div className="loading-screen">Загрузка...</div>;
  }

  // Если пользователь авторизован, перенаправляем на главную страницу
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Если пользователь не авторизован, показываем публичный контент
  return children;
};

export default PublicRoute; 