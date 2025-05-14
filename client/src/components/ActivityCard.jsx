import React from 'react'
import '../styles/ActivityCard.css'

const ActivityCard = ({ title, value, type }) => {
  // Определение иконки и единицы измерения в зависимости от типа
  let icon = '📊'
  let unit = ''
  
  switch (type) {
    case 'steps':
      icon = '👣'
      unit = 'шагов'
      break
    case 'calories':
      icon = '🔥'
      unit = 'ккал'
      break
    case 'activityMinutes':
      icon = '⏱️'
      unit = 'мин'
      break
    default:
      break
  }

  // Форматирование значения с разделителями тысяч
  const formattedValue = value ? value.toLocaleString('ru-RU') : '0'

  return (
    <div className='activity-card section' data-type={type || 'default'}>
      <div className='activity-card-header'>
        <div className="activity-card-icon">{icon}</div>
        <h3>{title}</h3>
      </div>
      <div className='activity-card-content'>
        <p className='activity-value'>{formattedValue}</p>
        <span className="activity-unit">{unit}</span>
      </div>
    </div>
  )
}

export default ActivityCard