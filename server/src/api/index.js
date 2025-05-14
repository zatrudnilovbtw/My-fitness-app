import express from 'express';
import activityRoutes from './routes/activityRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const router = express.Router();

// Базовый маршрут API
router.get('/', (req, res) => {
  res.json({ message: 'Добро пожаловать в API трекера активности!' });
});

// Подключаем маршруты активности
router.use('/activity', activityRoutes);

// Подключаем маршруты авторизации
router.use('/auth', authRoutes);

// Подключаем маршруты пользователя
router.use('/users', userRoutes);

export default router; 