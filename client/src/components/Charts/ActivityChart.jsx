import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { activityService } from '../../services/api';

// Регистрируем необходимые компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ActivityChart = ({ userId, period = 'week', type = 'steps' }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivityData = async () => {
      if (!userId) {
        setLoading(false);
        setError('Требуется авторизация');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Определяем даты периода
        const endDate = new Date();
        let startDate;

        switch (period) {
          case 'month':
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 1);
            break;
          case 'week':
          default:
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 6); // Неделя (7 дней)
            break;
        }

        // Форматируем даты для API
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];

        // Получаем данные из API
        const activities = await activityService.getActivitiesByPeriod(
          userId, 
          formattedStartDate, 
          formattedEndDate
        );
        
        // Если активностей нет, показываем сообщение
        if (!activities || activities.length === 0) {
          setError('Нет данных за выбранный период');
          setLoading(false);
          return;
        }
        
        // Сортируем по дате
        const sortedActivities = activities.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Подготавливаем данные для графика
        const labels = sortedActivities.map(activity => {
          const date = new Date(activity.date);
          return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
        });
        
        let data;
        let label;
        let borderColor;
        
        switch (type) {
          case 'calories':
            data = sortedActivities.map(activity => activity.calories);
            label = 'Калории (ккал)';
            borderColor = 'rgb(255, 99, 132)';
            break;
          case 'activityMinutes':
            data = sortedActivities.map(activity => activity.activityMinutes);
            label = 'Время активности (мин)';
            borderColor = 'rgb(54, 162, 235)';
            break;
          case 'steps':
          default:
            data = sortedActivities.map(activity => activity.steps);
            label = 'Шаги';
            borderColor = 'rgb(75, 192, 192)';
            break;
        }
        
        setChartData({
          labels,
          datasets: [
            {
              label,
              data,
              borderColor,
              backgroundColor: borderColor.replace(')', ', 0.2)').replace('rgb', 'rgba'),
              tension: 0.3,
            },
          ],
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке данных активности:', error);
        setError('Ошибка загрузки данных');
        setLoading(false);
      }
    };

    fetchActivityData();
  }, [userId, period, type]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: type === 'steps' 
          ? 'Шаги за период' 
          : type === 'calories' 
            ? 'Калории за период' 
            : 'Активность за период',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="activity-chart">
      {loading ? (
        <div className="loading">Загрузка данных...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <Line options={options} data={chartData} />
      )}
    </div>
  );
};

export default ActivityChart; 