import React from 'react'
import '../styles/ActivityCard.css'

const ActivityCard = ({ title, value, type }) => {
  return (
    <div className='activity-card section' data-type={type || 'default'}>
      <div className='activity-card-header'>
        <h3>{title}</h3>
      </div>
      <div className='activity-card-content'>
        <p className='activity-value'>{value}</p>
      </div>
    </div>
  )
}

export default ActivityCard