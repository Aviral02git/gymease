import React, { useState } from 'react';
import Button from '../common/ui/Button';
import Input from '../common/ui/Input';
import './TrackerForms.css';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack', 'drink'];

const CalorieTracker = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    calories: '',
    type: 'consumed',
    meal: 'lunch',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.calories) {
      alert('Please enter calorie amount');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form className="tracker-form" onSubmit={handleSubmit}>
      <h2>🍎 Log Calories</h2>

      <div className="form-group">
        <label>Date</label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
        />
      </div>

      <div className="form-group">
        <label>Type</label>
        <div className="type-buttons">
          <button
            type="button"
            className={`type-btn ${formData.type === 'consumed' ? 'active' : ''}`}
            onClick={() => setFormData((prev) => ({ ...prev, type: 'consumed' }))}
          >
            🍽️ Consumed
          </button>
          <button
            type="button"
            className={`type-btn ${formData.type === 'burned' ? 'active' : ''}`}
            onClick={() => setFormData((prev) => ({ ...prev, type: 'burned' }))}
          >
            🔥 Burned
          </button>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Calories *</label>
          <Input
            type="number"
            placeholder="250"
            value={formData.calories}
            onChange={(e) => setFormData((prev) => ({ ...prev, calories: e.target.value }))}
            min="0"
          />
        </div>

        {formData.type === 'consumed' && (
          <div className="form-group">
            <label>Meal Type</label>
            <select
              value={formData.meal}
              onChange={(e) => setFormData((prev) => ({ ...prev, meal: e.target.value }))}
              className="select-input"
            >
              {MEAL_TYPES.map((meal) => (
                <option key={meal} value={meal}>
                  {meal.charAt(0).toUpperCase() + meal.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea
          placeholder="What did you eat/burn?"
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          rows="3"
          className="textarea"
        ></textarea>
      </div>

      <Button type="submit" className="submit-btn">
        Save Entry
      </Button>
    </form>
  );
};

export default CalorieTracker;
