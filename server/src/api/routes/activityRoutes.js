import express from 'express';
import * as activityController from '../../controllers/activityController.js';

const router = express.Router();

// Получить активности пользователя
router.get('/users/:userId/activities', activityController.getUserActivities);

// Получить активности пользователя за период
router.get('/users/:userId/activities/period', activityController.getActivitiesByPeriod);

// Создать новую запись активности
router.post('/activities', activityController.createActivity);

// Обновить запись активности
router.put('/activities/:id', activityController.updateActivity);

// Удалить запись активности
router.delete('/activities/:id', activityController.deleteActivity);

export default router; 