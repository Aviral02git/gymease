import React, { useState, useEffect } from 'react';
import { useFitness } from '../context/FitnessContext';
import { useAuth } from '../context/AuthContext';
import Button from '../../components/common/ui/Button';
import Card from '../../components/common/ui/Card';
import Input from '../../components/common/ui/Input';
import WorkoutLogger from '../../components/features/WorkoutLogger';
import WeightTracker from '../../components/features/WeightTracker';
import CalorieTracker from '../../components/features/CalorieTracker';
import ProgressCharts from '../../components/features/ProgressCharts';
import './FitnessTracker.css';

const FitnessTracker = () => {
  const { user } = useAuth();
  const { fitnessData, loading, error, loadFitnessData, logWorkout, logWeight, logCalorie } = useFitness();
  const [activeTab, setActiveTab] = useState('overview');
  const [showLogModal, setShowLogModal] = useState(false);
  const [logType, setLogType] = useState('workout');

  useEffect(() => {
    if (user?.id) {
      loadFitnessData(user.id);
    }
  }, [user, loadFitnessData]);

  if (!user) {
    return (
      <div className="fitness-tracker-container">
        <Card className="auth-prompt">
          <h2>📊 Sign in to Track Your Fitness</h2>
          <p>Please log in to access your personalized fitness tracker</p>
        </Card>
      </div>
    );
  }

  const handleLogWorkout = async (workoutData) => {
    try {
      await logWorkout(user.id, workoutData);
      setShowLogModal(false);
      loadFitnessData(user.id);
    } catch (err) {
      console.error('Failed to log workout:', err);
    }
  };

  const handleLogWeight = async (weightData) => {
    try {
      await logWeight(user.id, weightData);
      setShowLogModal(false);
      loadFitnessData(user.id);
    } catch (err) {
      console.error('Failed to log weight:', err);
    }
  };

  const handleLogCalorie = async (calorieData) => {
    try {
      await logCalorie(user.id, calorieData);
      setShowLogModal(false);
      loadFitnessData(user.id);
    } catch (err) {
      console.error('Failed to log calorie:', err);
    }
  };

  return (
    <div className="fitness-tracker-container">
      <div className="tracker-header">
        <h1>💪 Your Fitness Progress</h1>
        <p>Track your workouts, weight, and calories all in one place</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Stats Overview */}
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon">🏋️</div>
          <div className="stat-content">
            <h3>{fitnessData.stats.totalWorkouts}</h3>
            <p>Total Workouts</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>{Math.round(fitnessData.stats.totalCaloriesBurned)}</h3>
            <p>Calories Burned</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">⚖️</div>
          <div className="stat-content">
            <h3>{fitnessData.stats.totalWeightLost.toFixed(1)} kg</h3>
            <p>Weight Lost</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>{fitnessData.streaks.currentStreak}</h3>
            <p>Current Streak 🔥</p>
          </div>
        </Card>
      </div>

      {/* Quick Log Buttons */}
      <div className="quick-log-buttons">
        <Button
          onClick={() => {
            setLogType('workout');
            setShowLogModal(true);
          }}
          className="log-button workout-btn"
        >
          + Log Workout
        </Button>
        <Button
          onClick={() => {
            setLogType('weight');
            setShowLogModal(true);
          }}
          className="log-button weight-btn"
        >
          + Log Weight
        </Button>
        <Button
          onClick={() => {
            setLogType('calorie');
            setShowLogModal(true);
          }}
          className="log-button calorie-btn"
        >
          + Log Calories
        </Button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab ${activeTab === 'workouts' ? 'active' : ''}`}
          onClick={() => setActiveTab('workouts')}
        >
          🏋️ Workouts
        </button>
        <button
          className={`tab ${activeTab === 'weight' ? 'active' : ''}`}
          onClick={() => setActiveTab('weight')}
        >
          ⚖️ Weight
        </button>
        <button
          className={`tab ${activeTab === 'calories' ? 'active' : ''}`}
          onClick={() => setActiveTab('calories')}
        >
          🍎 Calories
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <Card className="overview-card">
            <ProgressCharts fitnessData={fitnessData} />
          </Card>
        )}

        {activeTab === 'workouts' && (
          <Card className="content-card">
            <h2>Your Workouts</h2>
            {fitnessData.workouts && fitnessData.workouts.length > 0 ? (
              <div className="workouts-list">
                {fitnessData.workouts.map((workout) => (
                  <div key={workout.id} className="workout-item">
                    <div className="workout-type">{workout.type.toUpperCase()}</div>
                    <div className="workout-details">
                      <p><strong>{workout.duration} mins</strong></p>
                      <p>🔥 {workout.caloriesBurned} cal</p>
                      <p>{new Date(workout.date).toLocaleDateString()}</p>
                    </div>
                    <div className="workout-intensity">{workout.intensity}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No workouts logged yet. Start tracking! 🚀</p>
            )}
          </Card>
        )}

        {activeTab === 'weight' && (
          <Card className="content-card">
            <h2>Weight Progress</h2>
            {fitnessData.weights && fitnessData.weights.length > 0 ? (
              <div className="weight-list">
                {fitnessData.weights.map((entry) => (
                  <div key={entry.id} className="weight-item">
                    <span className="weight-value">{entry.weight} kg</span>
                    <span className="weight-date">{new Date(entry.date).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No weight entries yet. Start logging! 📈</p>
            )}
          </Card>
        )}

        {activeTab === 'calories' && (
          <Card className="content-card">
            <h2>Calorie Tracking</h2>
            {fitnessData.calories && fitnessData.calories.length > 0 ? (
              <div className="calories-list">
                {fitnessData.calories.map((entry) => (
                  <div key={entry.id} className="calorie-item">
                    <div className="calorie-type">{entry.type}</div>
                    <div className="calorie-details">
                      <p><strong>{entry.calories} cal</strong></p>
                      <p>{entry.meal}</p>
                      <p>{new Date(entry.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No calorie entries yet. Start tracking! 🍎</p>
            )}
          </Card>
        )}
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="modal-overlay" onClick={() => setShowLogModal(false)}>
          <Card className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowLogModal(false)}>
              ✕
            </button>

            {logType === 'workout' && <WorkoutLogger onSubmit={handleLogWorkout} />}
            {logType === 'weight' && <WeightTracker onSubmit={handleLogWeight} />}
            {logType === 'calorie' && <CalorieTracker onSubmit={handleLogCalorie} />}
          </Card>
        </div>
      )}
    </div>
  );
};

export default FitnessTracker;
