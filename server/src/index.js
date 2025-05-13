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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключаем API маршруты
app.use('/', apiRoutes);

// Порт
const PORT = process.env.PORT || 5000;

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
