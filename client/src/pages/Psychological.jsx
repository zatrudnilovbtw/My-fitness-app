import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { psychologicalService } from '../services/api'
import '../styles/Psychological.css'

const Psychological = () => {
  const { currentUser } = useAuth()
  const [formData, setFormData] = useState({
    stressLevel: 3,
    activityLevel: 3,
    moodScore: 3,
    notes: ''
  })
  const [lastAssessment, setLastAssessment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(true)
  // Добавляем счетчик обновлений для принудительного обновления
  const [refreshCounter, setRefreshCounter] = useState(0)

  useEffect(() => {
    // Загружаем последнюю оценку при монтировании компонента или изменении счетчика обновлений
    const fetchLastAssessment = async () => {
      if (!currentUser || !currentUser.id) {
        setLoadingHistory(false)
        return
      }

      try {
        setLoadingHistory(true)
        const assessment = await psychologicalService.getLatestAssessment(currentUser.id)
        console.log('Получена последняя оценка:', assessment)
        setLastAssessment(assessment)
      } catch (error) {
        console.error('Ошибка при загрузке последней оценки:', error)
        // Если оценки не найдены (404), это нормально для нового пользователя
        if (error.response && error.response.status === 404) {
          setLastAssessment(null)
        } else {
          // Логируем только неожиданные ошибки
          console.error('Неожиданная ошибка при загрузке оценки:', error)
        }
      } finally {
        setLoadingHistory(false)
      }
    }

    fetchLastAssessment()
  }, [currentUser, refreshCounter]) // Добавляем refreshCounter как зависимость

  // Сбрасываем сообщения об успехе через 3 секунды
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'notes' ? value : Number(value)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!currentUser || !currentUser.id) {
      setError('Требуется авторизация')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    // Создаем данные для отправки
    const dataToSubmit = {
      userId: currentUser.id,
      ...formData,
      date: new Date().toISOString().split('T')[0]
    }

    console.log('Отправка данных на сервер:', dataToSubmit)

    try {
      await psychologicalService.createAssessment(dataToSubmit)

      // Упрощаем логику: просто увеличиваем счетчик обновлений, 
      // что вызовет повторный запрос последней оценки
      setRefreshCounter(prev => prev + 1)

      setSuccess(true)

      // Сбрасываем форму
      setFormData({
        stressLevel: 3,
        activityLevel: 3,
        moodScore: 3,
        notes: ''
      })
    } catch (error) {
      console.error('Ошибка при сохранении оценки:', error)
      setError('Ошибка при сохранении оценки. Попробуйте снова.')
    } finally {
      setLoading(false)
    }
  }

  const getLevelDescription = (type, value) => {
    const descriptions = {
      stressLevel: {
        1: 'Отсутствует',
        2: 'Незначительный',
        3: 'Умеренный',
        4: 'Повышенный',
        5: 'Очень высокий'
      },
      activityLevel: {
        1: 'Очень низкий',
        2: 'Низкий',
        3: 'Средний',
        4: 'Высокий',
        5: 'Очень высокий'
      },
      moodScore: {
        1: 'Очень плохое',
        2: 'Плохое',
        3: 'Нейтральное',
        4: 'Хорошее',
        5: 'Отличное'
      }
    }

    return descriptions[type][value] || ''
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Функция принудительного обновления последней оценки
  const refreshLatestAssessment = () => {
    // Просто увеличиваем счетчик обновлений
    setRefreshCounter(prev => prev + 1)
  }

  // Отрисовка компонента
  const renderResult = (
    <div className="psychological-page">
      <h1 className="page-title">Оценка психологического состояния</h1>

      <div className="assessment-container">
        <div className="assessment-form-container">
          <h2>Заполните опрос</h2>
          <p className="form-description">
            Оцените ваше текущее психологическое состояние по шкале от 1 до 5
          </p>

          <form onSubmit={handleSubmit} className="assessment-form">
            <div className="form-group">
              <label>Уровень стресса</label>
              <div className="slider-container">
                <input
                  type="range"
                  name="stressLevel"
                  min="1"
                  max="5"
                  value={formData.stressLevel}
                  onChange={handleChange}
                  className="slider"
                />
                <div className="slider-value">
                  {formData.stressLevel} - {getLevelDescription('stressLevel', formData.stressLevel)}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Уровень активности</label>
              <div className="slider-container">
                <input
                  type="range"
                  name="activityLevel"
                  min="1"
                  max="5"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className="slider"
                />
                <div className="slider-value">
                  {formData.activityLevel} - {getLevelDescription('activityLevel', formData.activityLevel)}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Эмоциональное состояние</label>
              <div className="slider-container">
                <input
                  type="range"
                  name="moodScore"
                  min="1"
                  max="5"
                  value={formData.moodScore}
                  onChange={handleChange}
                  className="slider"
                />
                <div className="slider-value">
                  {formData.moodScore} - {getLevelDescription('moodScore', formData.moodScore)}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Заметки (необязательно)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Опишите своё самочувствие или события, повлиявшие на ваше состояние..."
                rows="4"
              ></textarea>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Сохранение...' : 'Сохранить оценку'}
            </button>

            {error && <p className="message-error">{error}</p>}
            {success && <p className="message-success">Оценка успешно сохранена!</p>}
          </form>
        </div>

        <div className="last-assessment-container">
          <div className="last-assessment-header">
            <h2>Последняя оценка</h2>

          </div>

          {loadingHistory ? (
            <p className="loading-message">Загрузка данных...</p>
          ) : lastAssessment ? (
            <div className="last-assessment">
              <p className="assessment-date">
                <strong>Дата:</strong> {formatDate(lastAssessment.date)}
              </p>
              <div className="assessment-item">
                <span>Уровень стресса:</span>
                <span className="assessment-value">
                  {lastAssessment.stressLevel} - {getLevelDescription('stressLevel', lastAssessment.stressLevel)}
                </span>
              </div>
              <div className="assessment-item">
                <span>Уровень активности:</span>
                <span className="assessment-value">
                  {lastAssessment.activityLevel} - {getLevelDescription('activityLevel', lastAssessment.activityLevel)}
                </span>
              </div>
              <div className="assessment-item">
                <span>Эмоциональное состояние:</span>
                <span className="assessment-value">
                  {lastAssessment.moodScore} - {getLevelDescription('moodScore', lastAssessment.moodScore)}
                </span>
              </div>
              {lastAssessment.notes && (
                <div className="assessment-notes">
                  <strong>Заметки:</strong>
                  <p>{lastAssessment.notes}</p>
                </div>
              )}
              <div className="assessment-debug">
                <small>Создано: {new Date(lastAssessment.createdAt).toLocaleString()}</small>
              </div>
            </div>
          ) : (
            <p className="no-data-message">У вас пока нет сохраненных оценок</p>
          )}
        </div>
      </div>
    </div>
  );

  return renderResult;
}

export default Psychological