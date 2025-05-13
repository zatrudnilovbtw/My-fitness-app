import { useState } from 'react'
import '../styles/Dashboard.css'
import StepCounter from '../components/StepCounter'
import ActivityCard from '../components/ActivityCard'
import Recommendations from '../components/Recommendations'
import ActivityChart from '../components/Charts/ActivityChart'

const Dashboard = () => {
  const [steps, setSteps] = useState(0)
  const [calories, setCalories] = useState(0)

  const handleStepSaver = (newSteps) => {
    setSteps(newSteps)

    const calculatedCalories = Math.round(newSteps * 0.05)
    setCalories(calculatedCalories)
  }
  
  return (
    <div className='dashboard'>
      <StepCounter onSave={handleStepSaver} />
      
      <div className='dashboard-metrics'>
        <ActivityCard title="Шаги за день" value={steps} type="steps" />
        <ActivityCard title="Сожженные калории" value={calories} type="calories" />
      </div>
      
      <div className='dashboard-chart-section'>
        <h2 className='section-title'>Активность за неделю</h2>
        <div className='chart-container'>
          <ActivityChart userId="mock-user-id" period="week" type="steps" />
        </div>
      </div>
      
      <Recommendations />
    </div>
  )
}

export default Dashboard