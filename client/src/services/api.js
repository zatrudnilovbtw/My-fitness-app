import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Создаем клиент axios
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Сервис для работы с активностью
export const activityService = {
  // Получить все активности пользователя
  getUserActivities: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}/activities`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении активностей:', error);
      throw error;
    }
  },

  // Получить активности за период
  getActivitiesByPeriod: async (userId, startDate, endDate) => {
    try {
      const response = await apiClient.get(`/users/${userId}/activities/period`, {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении активностей за период:', error);
      throw error;
    }
  },

  // Создать новую запись об активности
  createActivity: async (activityData) => {
    try {
      const response = await apiClient.post('/activities', activityData);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании активности:', error);
      throw error;
    }
  },

  // Обновить запись об активности
  updateActivity: async (id, activityData) => {
    try {
      const response = await apiClient.put(`/activities/${id}`, activityData);
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении активности:', error);
      throw error;
    }
  },

  // Удалить запись об активности
  deleteActivity: async (id) => {
    try {
      const response = await apiClient.delete(`/activities/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при удалении активности:', error);
      throw error;
    }
  },
};

export default { activityService }; 