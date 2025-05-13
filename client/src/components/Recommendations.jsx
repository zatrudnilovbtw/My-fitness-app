import React, { useEffect, useState } from 'react'
import '../styles/Recommendations.css'
import {recommendations} from '../pages/Phrases'
const Recommendations = () => {
  const [randomRecommendation, setRandomRecommendation] = useState(null);

  useEffect(() => {
    // Выбираем случайную рекомендацию при монтировании компонента
    const randomIndex = Math.floor(Math.random() * recommendations.length);
    setRandomRecommendation(recommendations[randomIndex]);
  }, []);

  return (
    <div className='recommendation-section'>
    <h2 className='section-title'>Рекомендации</h2>
    <div className='recommendations-container'>
      <div id="random-text">
        {randomRecommendation && (
          <div className="recommendation-card">
            <h3>{randomRecommendation.title}</h3>
            <p>{randomRecommendation.description}</p>
          </div>
        )}
      </div>
    </div>
  </div>
  )
}

export default Recommendations