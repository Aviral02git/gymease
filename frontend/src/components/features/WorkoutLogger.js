import React, { useState } from 'react';
import Button from '../common/ui/Button';
import Input from '../common/ui/Input';
import './WorkoutLogger.css';

const WORKOUT_TYPES = ['cardio', 'strength', 'yoga', 'sports', 'flexibility', 'swimming', 'cycling', 'hiit'];
const INTENSITY_LEVELS = ['low', 'medium', 'high'];

const WorkoutLogger = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'cardio',
    duration: '',
    caloriesBurned: '',
    intensity: 'medium',
    exercises: [],
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [exerciseInput, setExerciseInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.duration) {
      alert('Please enter workout duration');
      return;
    }
    onSubmit(formData);
  };

  const addExercise = () => {
    if (exerciseInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        exercises: [...prev.exercises, exerciseInput.trim()]
      }));
      setExerciseInput('');
    }
  };

  const removeExercise = (index) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  return (
    <form className="workout-logger" onSubmit={handleSubmit}>
      <h2>🏋️ Log Your Workout</h2>

      <div className="form-group">
        <label>Date</label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
        />
      </div>

      <div className="form-group">
        <label>Workout Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
          className="select-input"
        >
          {WORKOUT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Duration (minutes) *</label>
          <Input
            type="number"
            placeholder="30"
            value={formData.duration}
            onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Intensity</label>
          <select
            value={formData.intensity}
            onChange={(e) => setFormData((prev) => ({ ...prev, intensity: e.target.value }))}
            className="select-input"
          >
            {INTENSITY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Calories Burned</label>
        <Input
          type="number"
          placeholder="250"
          value={formData.caloriesBurned}
          onChange={(e) => setFormData((prev) => ({ ...prev, caloriesBurned: e.target.value }))}
          min="0"
        />
      </div>

      <div className="form-group">
        <label>Exercises</label>
        <div className="exercise-input-group">
          <Input
            type="text"
            placeholder="e.g., 10 pushups, 20 squats"
            value={exerciseInput}
            onChange={(e) => setExerciseInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExercise())}
          />
          <button type="button" onClick={addExercise} className="add-btn">
            +
          </button>
        </div>

        {formData.exercises.length > 0 && (
          <div className="exercises-list">
            {formData.exercises.map((exercise, index) => (
              <div key={index} className="exercise-tag">
                {exercise}
                <button
                  type="button"
                  onClick={() => removeExercise(index)}
                  className="remove-btn"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea
          placeholder="How did the workout feel? Any observations?"
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          rows="3"
          className="textarea"
        ></textarea>
      </div>

      <Button type="submit" className="submit-btn">
        Save Workout
      </Button>
    </form>
  );
};

export default WorkoutLogger;
