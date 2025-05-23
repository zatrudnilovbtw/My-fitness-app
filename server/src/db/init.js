import sequelize from './config.js';
import { User, Activity, PsychologicalAssessment } from '../models/index.js';

const initDb = async () => {
  try {
    // Проверка соединения с базой данных
    await sequelize.authenticate();
    console.log('Соединение с базой данных установлено успешно.');

    // Синхронизация моделей с базой данных
    // Используем { alter: false } чтобы предотвратить изменение типов
    await sequelize.sync({ alter: false });
    console.log('Модели синхронизированы с базой данных.');

    return true;
  } catch (error) {
    console.error('Ошибка при инициализации базы данных:', error);
    return false;
  }
};

export default initDb; 