import express from 'express';
import * as userController from '../../controllers/userController.js';
import authMiddleware from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Получить данные пользователя
router.get('/:id', authMiddleware, userController.getUserById);

// Обновить данные пользователя
router.put('/:id', authMiddleware, userController.updateUser);

// Удалить пользователя
router.delete('/:id', authMiddleware, userController.deleteUser);

export default router; 