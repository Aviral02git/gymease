import React, { useMemo } from 'react';
import './ProgressCharts.css';

const ProgressCharts = ({ fitnessData }) => {
  // Process data for charts
  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const weekData = {};

    // Initialize all days
    days.forEach((day) => {
      weekData[day] = 0;
    });

    // Count workouts per day
    if (fitnessData.workouts) {
      fitnessData.workouts.forEach((workout) => {
        const workoutDate = new Date(workout.date);
        const dayOfWeek = workoutDate.getDay();
        const dayName = days[(dayOfWeek || 7) - 1];
        weekData[dayName]++;
      });
    }

    return days.map((day) => ({
      day,
      workouts: weekData[day]
    }));
  }, [fitnessData.workouts]);

  const caloriesData = useMemo(() => {
    const consumed = fitnessData.calories
      ? fitnessData.calories
        .filter((c) => c.type === 'consumed')
        .reduce((sum, c) => sum + c.calories, 0)
      : 0;

    const burned = fitnessData.calories
      ? fitnessData.calories
        .filter((c) => c.type === 'burned')
        .reduce((sum, c) => sum + c.calories, 0)
      : 0;

    return { consumed, burned };
  }, [fitnessData.calories]);

  const getMaxValue = (data) => {
    const max = Math.max(...data.map((d) => d.workouts || 0), 5);
    return Math.ceil(max / 5) * 5;
  };

  const maxWorkouts = getMaxValue(weeklyData);

  return (
    <div className="progress-charts">
      <h2>📊 Your Progress</h2>

      <div className="charts-grid">
        {/* Weekly Workout Chart */}
        <div className="chart-card">
          <h3>Weekly Workouts</h3>
          <div className="bar-chart">
            <div className="y-axis">
              {[maxWorkouts, maxWorkouts * 0.75, maxWorkouts * 0.5, maxWorkouts * 0.25, 0].map((val) => (
                <div key={val} className="y-label">
                  {val}
                </div>
              ))}
            </div>

            <div className="bars-container">
              {weeklyData.map((data) => {
                const height = (data.workouts / maxWorkouts) * 200;
                return (
                  <div key={data.day} className="bar-group">
                    <div className="bar-wrapper">
                      <div className="bar" style={{ height: `${height}px` }}></div>
                    </div>
                    <span className="bar-label">{data.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Calories Balance */}
        <div className="chart-card">
          <h3>Calorie Balance</h3>
          <div className="calorie-chart">
            <div className="calorie-item">
              <div className="calorie-circle consumed">
                <span className="calorie-emoji">🍽️</span>
              </div>
              <p className="calorie-label">Consumed</p>
              <p className="calorie-value">{caloriesData.consumed} cal</p>
            </div>

            <div className="vs-text">vs</div>

            <div className="calorie-item">
              <div className="calorie-circle burned">
                <span className="calorie-emoji">🔥</span>
              </div>
              <p className="calorie-label">Burned</p>
              <p className="calorie-value">{caloriesData.burned} cal</p>
            </div>
          </div>

          <div className="balance-bar">
            {caloriesData.consumed > 0 && (
              <>
                <div
                  className="balance-consumed"
                  style={{
                    width: `${(caloriesData.consumed / (caloriesData.consumed + caloriesData.burned)) * 100}%`
                  }}
                ></div>
                <div
                  className="balance-burned"
                  style={{
                    width: `${(caloriesData.burned / (caloriesData.consumed + caloriesData.burned)) * 100}%`
                  }}
                ></div>
              </>
            )}
          </div>
        </div>

        {/* Weight Trend */}
        <div className="chart-card">
          <h3>Weight Trend</h3>
          {fitnessData.weights && fitnessData.weights.length > 0 ? (
            <div className="weight-summary">
              <div className="weight-stat">
                <p className="stat-label">Starting</p>
                <p className="stat-value">{fitnessData.weights[0].weight} kg</p>
              </div>

              <div className="weight-stat">
                <p className="stat-label">Current</p>
                <p className="stat-value">
                  {fitnessData.weights[fitnessData.weights.length - 1].weight} kg
                </p>
              </div>

              <div className="weight-stat">
                <p className="stat-label">Lost</p>
                <p className="stat-value loss">
                  {(fitnessData.weights[0].weight - fitnessData.weights[fitnessData.weights.length - 1].weight).toFixed(1)} kg ⬇️
                </p>
              </div>
            </div>
          ) : (
            <p className="empty-chart">Start logging your weight to see trends</p>
          )}
        </div>

        {/* Streaks & Achievements */}
        <div className="chart-card">
          <h3>🔥 Streaks & Achievements</h3>
          <div className="achievements">
            <div className="achievement-item">
              <span className="achievement-icon">🔥</span>
              <div className="achievement-text">
                <p className="achievement-label">Current Streak</p>
                <p className="achievement-value">{fitnessData.streaks.currentStreak} days</p>
              </div>
            </div>

            <div className="achievement-item">
              <span className="achievement-icon">⭐</span>
              <div className="achievement-text">
                <p className="achievement-label">Longest Streak</p>
                <p className="achievement-value">{fitnessData.streaks.longestStreak} days</p>
              </div>
            </div>

            <div className="achievement-item">
              <span className="achievement-icon">🏋️</span>
              <div className="achievement-text">
                <p className="achievement-label">Weekly Average</p>
                <p className="achievement-value">{fitnessData.stats.averageWeeklyWorkouts} workouts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Progress */}
      <div className="goals-section">
        <h3>🎯 Goals Progress</h3>
        <div className="goals-grid">
          <div className="goal-item">
            <p className="goal-name">🏋️ Total Workouts</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${Math.min((fitnessData.stats.totalWorkouts / 50) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {fitnessData.stats.totalWorkouts} / 50
            </span>
          </div>

          <div className="goal-item">
            <p className="goal-name">🔥 Calories This Week</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min((fitnessData.stats.totalCaloriesBurned / 2000) * 100, 100)}%`
                }}
              ></div>
            </div>
            <span className="progress-text">
              {Math.round(fitnessData.stats.totalCaloriesBurned)} / 2000 cal
            </span>
          </div>

          <div className="goal-item">
            <p className="goal-name">⚖️ Weight Loss</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min((fitnessData.stats.totalWeightLost / 10) * 100, 100)}%`
                }}
              ></div>
            </div>
            <span className="progress-text">
              {fitnessData.stats.totalWeightLost.toFixed(1)} / 10 kg
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCharts;
