import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware для проверки авторизации пользователя
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Не авторизован, токен отсутствует или неверный формат'
      });
    }

    // Извлекаем токен
    const token = authHeader.split(' ')[1];

    // Верифицируем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');

    // Находим пользователя по ID из токена
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден'
      });
    }

    // Добавляем информацию о пользователе в объект запроса
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    // Передаем управление следующему middleware
    next();
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Невалидный токен'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Срок действия токена истек'
      });
    }

    res.status(500).json({
      message: 'Ошибка сервера при авторизации'
    });
  }
};

export default authMiddleware; 