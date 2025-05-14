import express from 'express';
import * as authController from '../../controllers/authController.js';

const router = express.Router();

// Регистрация нового пользователя
router.post('/register', authController.register);

// Авторизация пользователя
router.post('/login', authController.login);

// Добавляем промежуточную функцию для логирования запросов к /me
router.get('/me', (req, res, next) => {
  console.log('GET /api/auth/me запрос получен');
  console.log('Заголовок Authorization:', req.headers.authorization);
  next();
}, authController.getMe);

export default router; 