import express from 'express';
import * as psychologicalController from '../../controllers/psychologicalController.js';

const router = express.Router();

// Тестовый маршрут для проверки работоспособности
router.get('/test', (req, res) => {
  return res.status(200).json({ message: 'Маршруты психологической оценки работают' });
});

// Получить все психологические оценки пользователя
router.get('/users/:userId/assessments', psychologicalController.getUserAssessments);

// Получить психологические оценки пользователя за период
router.get('/users/:userId/assessments/period', psychologicalController.getAssessmentsByPeriod);

// Получить последнюю психологическую оценку пользователя
router.get('/users/:userId/assessments/latest', psychologicalController.getLatestAssessment);

// Создать новую психологическую оценку
router.post('/assessments', psychologicalController.createAssessment);

export default router; 