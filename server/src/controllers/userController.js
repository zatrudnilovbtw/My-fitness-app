import User from '../models/User.js';

/**
 * Получить пользователя по ID
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Проверяем, имеет ли пользователь доступ к данным
    if (req.user.id !== id) {
      return res.status(403).json({
        message: 'Нет доступа к данным другого пользователя'
      });
    }

    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'age', 'gender']
    });

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден'
      });
    }

    res.status(200).json({
      user
    });
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    res.status(500).json({
      message: 'Ошибка сервера при получении пользователя'
    });
  }
};

/**
 * Обновить данные пользователя
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, gender } = req.body;

    // Проверяем, имеет ли пользователь доступ к данным
    if (req.user.id !== id) {
      return res.status(403).json({
        message: 'Нет доступа к изменению данных другого пользователя'
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден'
      });
    }

    // Обновляем данные пользователя
    user.name = name || user.name;
    user.age = age !== undefined ? age : user.age;
    user.gender = gender || user.gender;

    await user.save();

    res.status(200).json({
      message: 'Данные пользователя успешно обновлены',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender
      }
    });
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    res.status(500).json({
      message: 'Ошибка сервера при обновлении пользователя'
    });
  }
};

/**
 * Удалить пользователя
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Проверяем, имеет ли пользователь доступ к данным
    if (req.user.id !== id) {
      return res.status(403).json({
        message: 'Нет доступа к удалению другого пользователя'
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден'
      });
    }

    await user.destroy();

    res.status(200).json({
      message: 'Пользователь успешно удален'
    });
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    res.status(500).json({
      message: 'Ошибка сервера при удалении пользователя'
    });
  }
}; 