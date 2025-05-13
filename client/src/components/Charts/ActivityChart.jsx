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

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        setLoading(true);
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

        // Временные моковые данные (раскомментируйте код ниже для использования реальных данных с API)
        // const activities = await activityService.getActivitiesByPeriod(userId, formattedStartDate, formattedEndDate);
        
        // Моковые данные (удалите этот блок, когда подключите реальный API)
        const mockActivities = [];
        let currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
          mockActivities.push({
            date: new Date(currentDate).toISOString().split('T')[0],
            steps: Math.floor(Math.random() * 5000) + 5000, // Случайное число от 5000 до 10000
            calories: Math.floor(Math.random() * 200) + 200, // Случайное число от 200 до 400
            activityMinutes: Math.floor(Math.random() * 30) + 30, // Случайное число от 30 до 60
          });
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // Сортируем по дате
        const sortedActivities = mockActivities.sort((a, b) => new Date(a.date) - new Date(b.date));
        
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
      ) : (
        <Line options={options} data={chartData} />
      )}
    </div>
  );
};

export default ActivityChart; 