import { PsychologicalAssessment } from '../models/index.js';
import { Op } from 'sequelize';

// Получить все записи психологической оценки пользователя
export const getUserAssessments = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const assessments = await PsychologicalAssessment.findAll({
      where: { userId },
      order: [['date', 'DESC']],
    });
    
    return res.status(200).json(assessments);
  } catch (error) {
    console.error('Ошибка при получении психологических оценок:', error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получить психологические оценки за определенный период
export const getAssessmentsByPeriod = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    
    const assessments = await PsychologicalAssessment.findAll({
      where: {
        userId,
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['date', 'ASC']],
    });
    
    return res.status(200).json(assessments);
  } catch (error) {
    console.error('Ошибка при получении психологических оценок по периоду:', error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Создать новую запись психологической оценки
export const createAssessment = async (req, res) => {
  try {
    const { userId, stressLevel, moodScore, activityLevel, notes, date } = req.body;
    
    console.log('SERVER: Получены данные для создания оценки:', req.body);
    
    const newAssessment = await PsychologicalAssessment.create({
      userId,
      stressLevel,
      moodScore,
      activityLevel,
      notes: notes || '',
      date: date || new Date(),
    });
    
    console.log('SERVER: Создана новая оценка:', newAssessment.toJSON());
    
    return res.status(201).json(newAssessment);
  } catch (error) {
    console.error('SERVER: Ошибка при создании психологической оценки:', error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получить последнюю психологическую оценку пользователя
export const getLatestAssessment = async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('SERVER: Запрос последней оценки для пользователя:', userId);

    // Добавляем номер версии для контроля изменений и диагностики
    console.log('SERVER: Версия контроллера 2.0');
    
    // Получаем последнюю оценку, сортируя по времени создания (самая новая первая)
    const assessment = await PsychologicalAssessment.findOne({
      where: { userId },
      order: [['createdAt', 'DESC']], // Сортируем только по времени создания
    });
    
    if (!assessment) {
      console.log('SERVER: Психологическая оценка не найдена для пользователя:', userId);
      return res.status(404).json({ message: 'Психологическая оценка не найдена' });
    }
    
    console.log('SERVER: Найдена последняя оценка:', assessment.toJSON());
    
    // Добавляем заголовок, чтобы предотвратить кэширование
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    return res.status(200).json(assessment);
  } catch (error) {
    console.error('SERVER: Ошибка при получении последней психологической оценки:', error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
}; 