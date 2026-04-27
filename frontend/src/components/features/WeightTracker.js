import React, { useState } from 'react';
import Button from '../common/ui/Button';
import Input from '../common/ui/Input';
import './TrackerForms.css';

const WeightTracker = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    weight: '',
    unit: 'kg',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.weight) {
      alert('Please enter your weight');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form className="tracker-form" onSubmit={handleSubmit}>
      <h2>⚖️ Log Your Weight</h2>

      <div className="form-group">
        <label>Date</label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Weight *</label>
          <Input
            type="number"
            placeholder="70"
            value={formData.weight}
            onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
            step="0.1"
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Unit</label>
          <select
            value={formData.unit}
            onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
            className="select-input"
          >
            <option value="kg">Kilograms (kg)</option>
            <option value="lbs">Pounds (lbs)</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea
          placeholder="Any observations about your weight?"
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          rows="3"
          className="textarea"
        ></textarea>
      </div>

      <Button type="submit" className="submit-btn">
        Save Weight
      </Button>
    </form>
  );
};

export default WeightTracker;
