import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Компонент для защищенных маршрутов, доступных только авторизованным пользователям
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Пока проверяем авторизацию, показываем загрузку
  if (loading) {
    return <div className="loading-screen">Загрузка...</div>;
  }

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Если пользователь авторизован, показываем защищенный контент
  return children;
};

export default ProtectedRoute; 