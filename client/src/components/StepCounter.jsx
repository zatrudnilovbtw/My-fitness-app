import React, { useState } from 'react'
import '../styles/StepCounter.css'

const StepCounter = ({ onSave }) => {
  const [steps, setSteps] = useState(0)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSave) onSave(steps)
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
        <button type="submit" className="submit-button">Сохранить</button>
      </form>
    </div>
  )
}

export default StepCounter