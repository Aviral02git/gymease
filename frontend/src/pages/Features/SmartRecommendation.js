import React, { useState, useEffect } from 'react';
import { recommendationService } from '../services/recommendationService';
import Button from '../../components/common/ui/Button';
import Card from '../../components/common/ui/Card';
import Input from '../../components/common/ui/Input';
import { formatINR } from '../utils/helpers';
import './SmartRecommendation.css';

const FITNESS_GOALS = [
  { id: 'weight loss', label: 'Weight Loss', emoji: '⚖️' },
  { id: 'muscle gain', label: 'Muscle Gain', emoji: '💪' },
  { id: 'flexibility', label: 'Flexibility', emoji: '🧘' },
  { id: 'endurance', label: 'Endurance', emoji: '🏃' },
  { id: 'general fitness', label: 'General Fitness', emoji: '🏋️' }
];

const TIME_PREFERENCES = [
  { id: 'morning', label: 'Morning (5-12 AM)', emoji: '🌅' },
  { id: 'afternoon', label: 'Afternoon (12-5 PM)', emoji: '☀️' },
  { id: 'evening', label: 'Evening (5-9 PM)', emoji: '🌆' },
  { id: 'night', label: 'Night (9 PM onwards)', emoji: '🌙' }
];

const SmartRecommendation = () => {
  const [preferences, setPreferences] = useState({
    budget: 3000,
    goals: ['general fitness'],
    preferredTime: 'evening',
    maxDistance: 10,
    city: '',
    latitude: null,
    longitude: null
  });

  const [recommendations, setRecommendations] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('preferences'); // 'preferences' or 'results'

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPreferences((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        () => {
          console.log('Location permission denied');
        }
      );
    }
  }, []);

  const handleGoalToggle = (goal) => {
    setPreferences((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleGetRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      setStep('results');

      const response = await recommendationService.getRecommendations(preferences);
      if (response.data?.data?.recommendations) {
        setRecommendations(response.data.data.recommendations);
      }
    } catch (err) {
      setError(err.message || 'Failed to get recommendations');
      setStep('preferences');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'preferences') {
    return (
      <div className="smart-recommendation-container">
        <div className="recommendation-header">
          <h1>🧠 Find the Best Gym for Me</h1>
          <p>Tell us your preferences and we'll recommend the perfect gym for you</p>
        </div>

        <Card className="preference-card">
          {/* Budget */}
          <div className="preference-section">
            <label>💰 Budget</label>
            <div className="budget-input">
              <Input
                type="number"
                value={preferences.budget}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    budget: parseInt(e.target.value) || 3000
                  }))
                }
                min="1000"
                max="10000"
                step="500"
              />
              <span className="budget-display">₹{preferences.budget}/month</span>
            </div>
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={preferences.budget}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  budget: parseInt(e.target.value)
                }))
              }
              className="budget-slider"
            />
          </div>

          {/* Fitness Goals */}
          <div className="preference-section">
            <label>🎯 Fitness Goals</label>
            <div className="goals-grid">
              {FITNESS_GOALS.map((goal) => (
                <button
                  key={goal.id}
                  className={`goal-button ${preferences.goals.includes(goal.id) ? 'active' : ''}`}
                  onClick={() => handleGoalToggle(goal.id)}
                >
                  <span className="emoji">{goal.emoji}</span>
                  <span>{goal.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Time */}
          <div className="preference-section">
            <label>🕐 Preferred Time</label>
            <div className="time-buttons">
              {TIME_PREFERENCES.map((time) => (
                <button
                  key={time.id}
                  className={`time-button ${preferences.preferredTime === time.id ? 'active' : ''}`}
                  onClick={() =>
                    setPreferences((prev) => ({
                      ...prev,
                      preferredTime: time.id
                    }))
                  }
                >
                  <span>{time.emoji}</span>
                  {time.label}
                </button>
              ))}
            </div>
          </div>

          {/* Distance */}
          <div className="preference-section">
            <label>📍 Max Distance</label>
            <div className="distance-input">
              <Input
                type="number"
                value={preferences.maxDistance}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    maxDistance: parseInt(e.target.value) || 10
                  }))
                }
                min="1"
                max="50"
                step="1"
              />
              <span className="distance-display">{preferences.maxDistance} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={preferences.maxDistance}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  maxDistance: parseInt(e.target.value)
                }))
              }
              className="distance-slider"
            />
          </div>

          {/* City */}
          <div className="preference-section">
            <label>🏙️ City (Optional)</label>
            <Input
              type="text"
              placeholder="Enter city name (e.g., Bengaluru)"
              value={preferences.city}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  city: e.target.value
                }))
              }
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <Button onClick={handleGetRecommendations} loading={loading} className="primary-button">
            {loading ? 'Finding Best Gyms...' : '✨ Get Recommendations'}
          </Button>
        </Card>
      </div>
    );
  }

  // Results Step
  return (
    <div className="smart-recommendation-container">
      <div className="results-header">
        <button className="back-button" onClick={() => setStep('preferences')}>
          ← Back
        </button>
        <h1>🎯 Top Gym Recommendations for You</h1>
        <p>Based on your preferences: {preferences.goals.join(', ')}</p>
      </div>

      {selectedGym ? (
        <div className="gym-detail-view">
          <button className="back-button" onClick={() => setSelectedGym(null)}>
            ← Back to Results
          </button>

          <Card className="gym-detail-card">
            <div className="gym-header">
              <h2>{selectedGym.name}</h2>
              <div className="gym-score">
                <div className="score-circle">{Math.round(selectedGym.recommendationScore)}</div>
                <span>Match Score</span>
              </div>
            </div>

            <div className="gym-info">
              <p>📍 {selectedGym.city}</p>
              <p>💰 {formatINR(selectedGym.monthlyPrice)}/month</p>
              <p>⭐ {selectedGym.rating} ({selectedGym.reviews} reviews)</p>
            </div>

            <div className="score-breakdown">
              <h3>Score Breakdown</h3>
              <div className="breakdown-item">
                <span>💰 Price Match</span>
                <div className="score-bar">
                  <div
                    className="score-fill"
                    style={{ width: `${selectedGym.scoreBreakdown.price}%` }}
                  ></div>
                </div>
                <span className="score-value">{selectedGym.scoreBreakdown.price}%</span>
              </div>

              <div className="breakdown-item">
                <span>🏋️ Facilities Match</span>
                <div className="score-bar">
                  <div
                    className="score-fill"
                    style={{ width: `${selectedGym.scoreBreakdown.facilities}%` }}
                  ></div>
                </div>
                <span className="score-value">{selectedGym.scoreBreakdown.facilities}%</span>
              </div>

              <div className="breakdown-item">
                <span>📍 Distance</span>
                <div className="score-bar">
                  <div
                    className="score-fill"
                    style={{ width: `${selectedGym.scoreBreakdown.distance}%` }}
                  ></div>
                </div>
                <span className="score-value">
                  {selectedGym.scoreBreakdown.distanceKm} km
                </span>
              </div>

              <div className="breakdown-item">
                <span>🕐 Timing</span>
                <div className="score-bar">
                  <div
                    className="score-fill"
                    style={{ width: `${selectedGym.scoreBreakdown.time}%` }}
                  ></div>
                </div>
                <span className="score-value">{selectedGym.scoreBreakdown.time}%</span>
              </div>

              <div className="breakdown-item">
                <span>⭐ Popularity</span>
                <div className="score-bar">
                  <div
                    className="score-fill"
                    style={{ width: `${selectedGym.scoreBreakdown.popularity}%` }}
                  ></div>
                </div>
                <span className="score-value">{selectedGym.scoreBreakdown.popularity}%</span>
              </div>
            </div>

            <div className="action-buttons">
              <Button className="primary-button">Start Trial</Button>
              <Button className="secondary-button">View Profile</Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="recommendations-grid">
          {recommendations.map((gym, index) => (
            <Card key={gym.id} className="recommendation-card">
              <div className="rank-badge">#{index + 1}</div>
              <div className="score-badge">{Math.round(gym.recommendationScore)}%</div>

              <h3>{gym.name}</h3>

              <div className="gym-details">
                <p>📍 {gym.city}</p>
                <p>💰 {formatINR(gym.monthlyPrice)}/month</p>
                <p>⭐ {gym.rating} ({gym.reviews} reviews)</p>
              </div>

              <div className="quick-score">
                <div className="score-item">
                  <span>💵</span>
                  <span>{gym.scoreBreakdown.price}%</span>
                </div>
                <div className="score-item">
                  <span>🏋️</span>
                  <span>{gym.scoreBreakdown.facilities}%</span>
                </div>
                <div className="score-item">
                  <span>📍</span>
                  <span>{gym.scoreBreakdown.distance}%</span>
                </div>
                <div className="score-item">
                  <span>⏰</span>
                  <span>{gym.scoreBreakdown.time}%</span>
                </div>
              </div>

              <Button
                onClick={() => setSelectedGym(gym)}
                className="view-button"
              >
                View Details →
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartRecommendation;
