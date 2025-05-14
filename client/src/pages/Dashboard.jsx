import { useState, useEffect } from 'react'
import '../styles/Dashboard.css'
import StepCounter from '../components/StepCounter'
import ActivityCard from '../components/ActivityCard'
import Recommendations from '../components/Recommendations'
import ActivityChart from '../components/Charts/ActivityChart'
import { activityService } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const Dashboard = () => {
  const [steps, setSteps] = useState(0)
  const [calories, setCalories] = useState(0)
  const [activityMinutes, setActivityMinutes] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [dashboardLoading, setDashboardLoading] = useState(true)
  const { currentUser } = useAuth()

  // Загрузка данных за текущий день при загрузке страницы
  useEffect(() => {
    const fetchTodayActivity = async () => {
      if (!currentUser || !currentUser.id) {
        setDashboardLoading(false)
        return
      }

      try {
        // Получаем сегодняшнюю дату
        const today = new Date().toISOString().split('T')[0]
        
        // Загружаем данные за сегодня
        const activities = await activityService.getActivitiesByPeriod(
          currentUser.id,
          today,
          today
        )

        // Если есть данные за сегодня, отображаем сумму всех записей
        if (activities && activities.length > 0) {
          // Считаем суммарные показатели за день
          const dailySteps = activities.reduce((sum, activity) => sum + activity.steps, 0)
          const dailyCalories = activities.reduce((sum, activity) => sum + activity.calories, 0)
          const dailyActivityMinutes = activities.reduce((sum, activity) => sum + activity.activityMinutes, 0)
          
          setSteps(dailySteps)
          setCalories(dailyCalories)
          setActivityMinutes(dailyActivityMinutes)
        }
      } catch (error) {
        console.error('Ошибка при загрузке активности за сегодня:', error)
      } finally {
        setDashboardLoading(false)
      }
    }

    fetchTodayActivity()
  }, [currentUser])

  // Сбрасываем сообщения об успехе через 3 секунды
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const handleStepSaver = async (newSteps, date) => {
    setLoading(true)
    setError('')
    setSuccess(false)

    // Расчет калорий на основе шагов (примерно)
    const calculatedCalories = Math.round(newSteps * 0.05)
    const calculatedActivityMinutes = Math.round(newSteps / 100) // Примерный расчет
    
    try {
      // Проверяем, что есть ID пользователя
      if (!currentUser || !currentUser.id) {
        throw new Error('Пользователь не авторизован или отсутствует ID пользователя')
      }

      // Сохраняем данные в БД
      await activityService.createActivity({
        userId: currentUser.id,
        steps: newSteps,
        calories: calculatedCalories,
        activityMinutes: calculatedActivityMinutes,
        date: date
      })
      
      // Проверяем совпадение даты с сегодняшней
      const today = new Date().toISOString().split('T')[0]
      if (date === today) {
        // Если запись за сегодня, обновляем итоги
        setSteps(prevSteps => prevSteps + newSteps)
        setCalories(prevCalories => prevCalories + calculatedCalories)
        setActivityMinutes(prevMinutes => prevMinutes + calculatedActivityMinutes)
      }
      
      setSuccess(true)
    } catch (err) {
      console.error('Ошибка при сохранении активности:', err)
      setError('Ошибка при сохранении данных. Попробуйте снова.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className='dashboard'>
      <StepCounter onSave={handleStepSaver} />
      
      {loading && <p className="message-loading">Сохранение данных...</p>}
      {error && <p className="message-error">{error}</p>}
      {success && <p className="message-success">Данные успешно сохранены!</p>}
      
      <div className='dashboard-metrics'>
        {dashboardLoading ? (
          <p className="message-loading">Загрузка данных...</p>
        ) : (
          <>
            <ActivityCard title="Шаги за день" value={steps} type="steps" />
            <ActivityCard title="Сожженные калории" value={calories} type="calories" />
            <ActivityCard title="Время активности" value={activityMinutes} type="activityMinutes" />
          </>
        )}
      </div>
      
      <div className='dashboard-chart-section'>
        <h2 className='section-title'>Активность за неделю</h2>
        <div className='chart-container'>
          <ActivityChart userId={currentUser?.id} period="week" type="steps" />
        </div>
      </div>
      
      <Recommendations />
    </div>
  )
}

export default Dashboard