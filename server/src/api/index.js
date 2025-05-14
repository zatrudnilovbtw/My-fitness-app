import express from 'express';
import activityRoutes from './routes/activityRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import psychologicalRoutes from './routes/psychologicalRoutes.js';

const router = express.Router();

// Базовый маршрут API
router.get('/', (req, res) => {
  res.json({ message: 'Добро пожаловать в API трекера активности!' });
});

// Промежуточная функция для отладки маршрутов
const debugRoutes = (req, res, next) => {
  console.log(`Запрос на маршрут: ${req.method} ${req.originalUrl}`);
  next();
};

// Подключаем маршруты активности
router.use('/activity', activityRoutes);

// Подключаем маршруты авторизации
router.use('/auth', authRoutes);

// Подключаем маршруты пользователя
router.use('/users', userRoutes);

// Подключаем маршруты психологической оценки с отладкой
router.use('/psychological', debugRoutes, psychologicalRoutes);

// Добавим тестовый маршрут на корневом уровне API
router.get('/test-psychological', (req, res) => {
  res.json({ message: 'Тестовый маршрут для психологической оценки работает' });
});

export default router; 