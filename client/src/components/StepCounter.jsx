import React, { useState } from 'react'
import '../styles/StepCounter.css'

const StepCounter = ({ onSave }) => {
  const [steps, setSteps] = useState(0)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]) // Текущая дата по умолчанию

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSave) onSave(steps, date)
  }

  return (
    <div className='step-counter section'>
      <h3 className="section-title">Введите количество шагов</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="steps">Количество шагов:</label>
          <input 
            type="number" 
            id="steps"
            value={steps}
            onChange={(e) => setSteps(Number(e.target.value))}
            min="0"
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Дата:</label>
          <input 
            type="date" 
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-button">Сохранить</button>
      </form>
    </div>
  )
}

export default StepCounter