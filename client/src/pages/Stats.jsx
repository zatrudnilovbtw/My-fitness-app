import { useState, useEffect } from 'react'
import ActivityChart from '../components/Charts/ActivityChart'
import '../styles/Stats.css'
import { useAuth } from '../contexts/AuthContext'
import { activityService } from '../services/api'

const Stats = () => {
  const [period, setPeriod] = useState('week')
  const [chartType, setChartType] = useState('steps')
  const [stats, setStats] = useState({
    averageSteps: 0,
    totalCalories: 0,
    totalActivityMinutes: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { currentUser } = useAuth()

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser || !currentUser.id) {
        setLoading(false)
        setError('Требуется авторизация')
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Определяем даты периода
        const endDate = new Date()
        let startDate

        switch (period) {
          case 'month':
            startDate = new Date()
            startDate.setMonth(startDate.getMonth() - 1)
            break
          case 'week':
          default:
            startDate = new Date()
            startDate.setDate(startDate.getDate() - 6) // Неделя (7 дней)
            break
        }

        // Форматируем даты для API
        const formattedStartDate = startDate.toISOString().split('T')[0]
        const formattedEndDate = endDate.toISOString().split('T')[0]

        // Получаем данные из API
        const activities = await activityService.getActivitiesByPeriod(
          currentUser.id, 
          formattedStartDate, 
          formattedEndDate
        )

        if (!activities || activities.length === 0) {
          setStats({
            averageSteps: 0,
            totalCalories: 0,
            totalActivityMinutes: 0
          })
          setLoading(false)
          return
        }

        // Вычисляем статистику
        const totalSteps = activities.reduce((sum, activity) => sum + activity.steps, 0)
        const totalCalories = activities.reduce((sum, activity) => sum + activity.calories, 0)
        const totalActivityMinutes = activities.reduce((sum, activity) => sum + activity.activityMinutes, 0)
        const averageSteps = Math.round(totalSteps / activities.length)

        setStats({
          averageSteps,
          totalCalories,
          totalActivityMinutes
        })

        setLoading(false)
      } catch (error) {
        console.error('Ошибка при загрузке статистики:', error)
        setError('Ошибка загрузки данных')
        setLoading(false)
      }
    }

    fetchStats()
  }, [currentUser, period])

  return (
    <div className="stats-page">
      <h1 className="page-title">Статистика активности</h1>

      <div className="filters">
        <div className="filter-group">
          <label>Период:</label>
          <div className="button-group">
            <button 
              className={period === 'week' ? 'active' : ''} 
              onClick={() => setPeriod('week')}
            >
              Неделя
            </button>
            <button 
              className={period === 'month' ? 'active' : ''} 
              onClick={() => setPeriod('month')}
            >
              Месяц
            </button>
          </div>
        </div>

        <div className="filter-group">
          <label>Показатель:</label>
          <div className="button-group">
            <button 
              className={chartType === 'steps' ? 'active' : ''} 
              onClick={() => setChartType('steps')}
            >
              Шаги
            </button>
            <button 
              className={chartType === 'calories' ? 'active' : ''} 
              onClick={() => setChartType('calories')}
            >
              Калории
            </button>
            <button 
              className={chartType === 'activityMinutes' ? 'active' : ''} 
              onClick={() => setChartType('activityMinutes')}
            >
              Активность
            </button>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <ActivityChart 
          userId={currentUser?.id} 
          period={period} 
          type={chartType} 
        />
      </div>

      {loading ? (
        <div className="loading">Загрузка статистики...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="stats-info">
          <div className="info-card">
            <h3>Общая статистика</h3>
            <div className="stat-item">
              <span>Среднее количество шагов:</span>
              <span className="value">{stats.averageSteps.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span>Всего сожжено калорий:</span>
              <span className="value">{stats.totalCalories.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span>Общее время активности:</span>
              <span className="value">{stats.totalActivityMinutes} мин</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Stats