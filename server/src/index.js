import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './api/index.js';
import initDb from './db/init.js';

// Загружаем переменные окружения
dotenv.config();

// Инициализируем экспресс
const app = express();

// Middleware
app.use(cors({
  origin: '*', // разрешаем запросы от любых источников
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Обработка ошибок JSON парсинга
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Неверный формат JSON' });
  }
  next();
});

// Подключаем API маршруты с префиксом /api
app.use('/api', apiRoutes);

// Логируем все маршруты
console.log('Зарегистрированные маршруты:');
app._router.stack.forEach(function(middleware){
  if(middleware.route){ // маршруты
    console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
  } else if(middleware.name === 'router'){ // маршруты подпрограмм router
    middleware.handle.stack.forEach(function(handler){
      if(handler.route){
        const fullPath = `/api${handler.route.path}`;
        console.log(`${Object.keys(handler.route.methods)} ${fullPath}`);
      } else if (handler.name === 'router') {
        // Проверяем подмаршруты второго уровня
        const baseUrl = getBasePath(middleware);
        handler.handle.stack.forEach(function(subHandler) {
          if (subHandler.route) {
            const fullSubPath = `/api${baseUrl}${subHandler.route.path}`;
            console.log(`${Object.keys(subHandler.route.methods)} ${fullSubPath}`);
          }
        });
      }
    });
  }
});

// Функция для получения базового пути роутера
function getBasePath(middleware) {
  // Извлекаем базовый путь из роутера
  // Например, для /api/psychological/
  return middleware.regexp.toString().match(/^\^\\\/([^\\]+)/)?.[1] || '';
}

// Обработка несуществующих маршрутов
app.use((req, res) => {
  console.log(`Маршрут не найден: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Маршрут не найден' });
});

// Порт
const PORT = process.env.PORT || 5001;

// Запускаем сервер
const startServer = async () => {
  try {
    // Инициализируем базу данных
    const dbInitialized = await initDb();
    
    if (!dbInitialized) {
      console.error('Не удалось инициализировать базу данных.');
      process.exit(1);
    }
    
    // Запускаем сервер
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  } catch (error) {
    console.error('Ошибка при запуске сервера:', error);
    process.exit(1);
  }
};

startServer();
