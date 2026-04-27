import React, { useState } from 'react';
import Button from '../common/ui/Button';
import Card from '../common/ui/Card';
import ComparisonTable from './ComparisonTable';
import { comparisonService } from '../../services/comparisonService';
import '../../pages/Features/GymComparison.css';

const ComparisonModal = ({ gyms = [], allGyms = [], isOpen, onClose }) => {
  const [selectedGyms, setSelectedGyms] = useState(gyms.map(g => g.id).slice(0, 3));
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Use provided gyms or allGyms for selection pool
  const availableGyms = gyms.length > 0 ? gyms : allGyms;

  if (!isOpen && !onClose) return null;

  const handleGymToggle = (gymId) => {
    if (selectedGyms.includes(gymId)) {
      setSelectedGyms(selectedGyms.filter(id => id !== gymId));
    } else {
      if (selectedGyms.length < 3) {
        setSelectedGyms([...selectedGyms, gymId]);
      }
    }
    setError('');
  };

  const handleCompare = async () => {
    if (selectedGyms.length < 2) {
      setError('Please select at least 2 gyms');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await comparisonService.compareGyms(selectedGyms);
      setComparison(response.data?.data || response.data);
    } catch (err) {
      setError('Failed to compare gyms');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedGyms([]);
    setComparison(null);
    setError('');
  };

  return (
    <div className="comparison-modal-overlay" onClick={onClose}>
      <div
        className="comparison-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="comparison-modal-close"
          aria-label="Close comparison"
        >
          ✕
        </button>

        {!comparison ? (
          <>
            {/* Selection View */}
            <div className="comparison-modal-header">
              <h2 className="text-2xl font-black uppercase tracking-tight">Compare Gyms</h2>
              <p className="text-textMuted text-sm mt-2">
                Select 2–3 gyms to compare features and pricing
              </p>
            </div>

            <div className="comparison-modal-body">
              {/* Gym Selection Grid - Minimalist */}
              <div className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto">
                {availableGyms.map((gym) => {
                  const isSelected = selectedGyms.includes(gym.id);
                  return (
                    <div
                      key={gym.id}
                      onClick={() => handleGymToggle(gym.id)}
                      className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-primary/10 border-primary'
                          : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                      }`}
                    >
                      {/* Checkbox */}
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected ? 'bg-primary border-primary' : 'border-white/30'
                      }`}>
                        {isSelected && <span className="text-xs text-black font-bold">✓</span>}
                      </div>

                      {/* Gym Image Thumbnail */}
                      <img
                        src={gym.image}
                        alt={gym.name}
                        className="w-12 h-12 object-cover rounded flex-shrink-0"
                      />

                      {/* Gym Info */}
                      <div className="flex-grow min-w-0">
                        <h4 className="font-bold text-sm text-white truncate">{gym.name}</h4>
                        <p className="text-xs text-textMuted truncate">{gym.location}</p>
                      </div>

                      {/* Price and Rating */}
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm text-primary">₹{gym.monthlyPrice}</p>
                        <p className="text-xs text-textMuted">★ {gym.rating}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded text-sm border border-red-500/30">
                  {error}
                </div>
              )}

              {/* Selection Counter */}
              {selectedGyms.length > 0 && (
                <div className="mb-4 text-center text-sm text-textMuted">
                  <span className="font-bold text-primary">{selectedGyms.length}</span>/3 gyms selected
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <Button
                  onClick={handleCompare}
                  disabled={selectedGyms.length < 2 || loading}
                  className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-white/10 disabled:cursor-not-allowed"
                >
                  {loading ? 'Comparing...' : `Compare ${selectedGyms.length > 0 ? `(${selectedGyms.length})` : ''}`}
                </Button>
                <Button
                  onClick={onClose}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Comparison Results View */}
            <div className="comparison-modal-header flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase tracking-tight">Results</h2>
              <Button
                onClick={handleReset}
                variant="secondary"
                size="sm"
                className="text-xs"
              >
                New Compare
              </Button>
            </div>

            <div className="comparison-modal-body max-h-[70vh] overflow-y-auto">
              <ComparisonTable comparison={comparison} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ComparisonModal;
