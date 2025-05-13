import { Activity } from '../models/index.js';
import { Op } from 'sequelize';

// Получить все записи активности пользователя
export const getUserActivities = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const activities = await Activity.findAll({
      where: { userId },
      order: [['date', 'DESC']],
    });
    
    return res.status(200).json(activities);
  } catch (error) {
    console.error('Ошибка при получении активностей:', error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получить активность за определенный период
export const getActivitiesByPeriod = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    
    const activities = await Activity.findAll({
      where: {
        userId,
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['date', 'ASC']],
    });
    
    return res.status(200).json(activities);
  } catch (error) {
    console.error('Ошибка при получении активностей по периоду:', error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Создать новую запись об активности
export const createActivity = async (req, res) => {
  try {
    const { userId, steps, calories, activityMinutes, date } = req.body;
    
    const newActivity = await Activity.create({
      userId,
      steps,
      calories,
      activityMinutes,
      date: date || new Date(),
    });
    
    return res.status(201).json(newActivity);
  } catch (error) {
    console.error('Ошибка при создании активности:', error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Обновить запись об активности
export const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { steps, calories, activityMinutes } = req.body;
    
    const activity = await Activity.findByPk(id);
    
    if (!activity) {
      return res.status(404).json({ message: 'Активность не найдена' });
    }
    
    await activity.update({
      steps,
      calories,
      activityMinutes,
    });
    
    return res.status(200).json(activity);
  } catch (error) {
    console.error('Ошибка при обновлении активности:', error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Удалить запись об активности
export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    
    const activity = await Activity.findByPk(id);
    
    if (!activity) {
      return res.status(404).json({ message: 'Активность не найдена' });
    }
    
    await activity.destroy();
    
    return res.status(200).json({ message: 'Активность удалена' });
  } catch (error) {
    console.error('Ошибка при удалении активности:', error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
}; 