import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Регистрация нового пользователя
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Проверяем наличие тела запроса
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: 'Тело запроса пустое или отсутствует'
      });
    }

    // Проверяем, что все необходимые поля присутствуют
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Все поля обязательны для заполнения'
      });
    }

    // Проверяем корректность email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Неверный формат email'
      });
    }

    // Проверяем, существует ли пользователь с таким email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: 'Пользователь с таким email уже существует'
      });
    }

    // Проверяем сложность пароля
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Пароль должен содержать не менее 6 символов'
      });
    }

    // Хешируем пароль
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Создаем нового пользователя
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Создаем JWT токен для автоматической авторизации
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    
    // Убедимся, что мы всегда отправляем ответ в формате JSON
    res.status(500).json({
      message: 'Ошибка сервера при регистрации',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Авторизация пользователя
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('login: Попытка входа для email:', email);

    // Проверяем, что все необходимые поля присутствуют
    if (!email || !password) {
      return res.status(400).json({
        message: 'Необходимо указать email и пароль'
      });
    }

    // Находим пользователя по email
    const user = await User.findOne({ where: { email } });
    console.log('login: Пользователь найден:', user ? 'да' : 'нет');
    
    if (!user) {
      return res.status(400).json({
        message: 'Неверный email или пароль'
      });
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('login: Пароль верный:', isPasswordValid ? 'да' : 'нет');
    
    if (!isPasswordValid) {
      return res.status(400).json({
        message: 'Неверный email или пароль'
      });
    }

    // Создаем JWT токен
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '7d' }
    );
    console.log('login: Сгенерирован токен для пользователя ID:', user.id);

    res.status(200).json({
      message: 'Авторизация успешна',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Ошибка при авторизации:', error);
    res.status(500).json({
      message: 'Ошибка сервера при авторизации'
    });
  }
};

/**
 * Получение информации о текущем пользователе
 */
export const getMe = async (req, res) => {
  try {
    // Получаем токен из заголовков
    const token = req.headers.authorization?.split(' ')[1];
    
    console.log('getMe: Получен токен:', token ? 'токен присутствует' : 'токен отсутствует');
    
    if (!token) {
      return res.status(401).json({
        message: 'Не авторизован, токен отсутствует'
      });
    }

    // Верифицируем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
    console.log('getMe: Декодированный токен:', decoded);
    
    // Находим пользователя по ID из токена
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'age', 'gender']
    });

    console.log('getMe: Найден пользователь:', user ? 'да' : 'нет');
    
    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден'
      });
    }

    res.status(200).json({
      user
    });
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Невалидный токен'
      });
    }

    res.status(500).json({
      message: 'Ошибка сервера при получении данных пользователя'
    });
  }
}; 