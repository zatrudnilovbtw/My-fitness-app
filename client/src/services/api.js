import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

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
      const response = await apiClient.get(`/activity/users/${userId}/activities`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении активностей:', error);
      throw error;
    }
  },

  // Получить активности за период
  getActivitiesByPeriod: async (userId, startDate, endDate) => {
    try {
      const response = await apiClient.get(`/activity/users/${userId}/activities/period`, {
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
      const response = await apiClient.post('/activity/activities', activityData);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании активности:', error);
      throw error;
    }
  },

  // Обновить запись об активности
  updateActivity: async (id, activityData) => {
    try {
      const response = await apiClient.put(`/activity/activities/${id}`, activityData);
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении активности:', error);
      throw error;
    }
  },

  // Удалить запись об активности
  deleteActivity: async (id) => {
    try {
      const response = await apiClient.delete(`/activity/activities/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при удалении активности:', error);
      throw error;
    }
  },
};

// Сервис для работы с психологическими оценками
export const psychologicalService = {
  // Получить все психологические оценки пользователя
  getUserAssessments: async (userId) => {
    try {
      const response = await apiClient.get(`/psychological/users/${userId}/assessments`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении психологических оценок:', error);
      throw error;
    }
  },

  // Получить психологические оценки за период
  getAssessmentsByPeriod: async (userId, startDate, endDate) => {
    try {
      const response = await apiClient.get(`/psychological/users/${userId}/assessments/period`, {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении психологических оценок за период:', error);
      throw error;
    }
  },

  // Получить последнюю психологическую оценку пользователя
  getLatestAssessment: async (userId) => {
    console.log('API: Запрос последней оценки для пользователя:', userId);
    console.log('API: Версия клиентского API 2.0');
    try {
      // Добавляем случайный параметр для предотвращения кэширования
      const timestamp = new Date().getTime();
      const response = await apiClient.get(
        `/psychological/users/${userId}/assessments/latest?_t=${timestamp}`
      );
      console.log('API: Получена последняя оценка:', response.data);
      console.log('API: ID последней оценки:', response.data.id);
      console.log('API: Дата создания:', response.data.createdAt);
      return response.data;
    } catch (error) {
      // Если оценки не найдены (404), это нормальная ситуация для нового пользователя
      if (error.response && error.response.status === 404) {
        console.log('API: Оценки не найдены для пользователя:', userId);
        return null;
      }
      // Логируем только неожиданные ошибки
      console.error('API: Ошибка при получении последней психологической оценки:', error);
      throw error;
    }
  },

  // Создать новую психологическую оценку
  createAssessment: async (assessmentData) => {
    console.log('API: Отправка данных оценки:', assessmentData);
    try {
      const response = await apiClient.post('/psychological/assessments', assessmentData);
      console.log('API: Получен ответ от сервера:', response.data);
      return response.data;
    } catch (error) {
      console.error('API: Ошибка при создании психологической оценки:', error);
      throw error;
    }
  },
};

export default { activityService, psychologicalService }; 