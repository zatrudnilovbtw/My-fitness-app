import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';
import User from './User.js';

const PsychologicalAssessment = sequelize.define('PsychologicalAssessment', {
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
  stressLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  moodScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  activityLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

// Определяем отношения
PsychologicalAssessment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(PsychologicalAssessment, { foreignKey: 'userId', as: 'psychologicalAssessments' });

export default PsychologicalAssessment; 