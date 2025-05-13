import { useState } from 'react'
import ActivityChart from '../components/Charts/ActivityChart'
import '../styles/Stats.css'

const Stats = () => {
  const [period, setPeriod] = useState('week')
  const [chartType, setChartType] = useState('steps')

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
          userId="mock-user-id" 
          period={period} 
          type={chartType} 
        />
      </div>

      <div className="stats-info">
        <div className="info-card">
          <h3>Общая статистика</h3>
          <div className="stat-item">
            <span>Среднее количество шагов:</span>
            <span className="value">7,500</span>
          </div>
          <div className="stat-item">
            <span>Всего сожжено калорий:</span>
            <span className="value">8,450</span>
          </div>
          <div className="stat-item">
            <span>Общее время активности:</span>
            <span className="value">420 мин</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stats