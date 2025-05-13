import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';
import User from './User.js';

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  steps: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  calories: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  activityMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  timestamps: true,
});

// Определяем отношения
Activity.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Activity, { foreignKey: 'userId', as: 'activities' });

export default Activity; 