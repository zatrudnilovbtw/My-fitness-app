import express from 'express';
import activityRoutes from './routes/activityRoutes.js';

const router = express.Router();

// Базовый маршрут API
router.get('/', (req, res) => {
  res.json({ message: 'Добро пожаловать в API трекера активности!' });
});

// Подключаем маршруты активности
router.use('/api', activityRoutes);

export default router; 