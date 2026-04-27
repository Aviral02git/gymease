import React, { useEffect, useState } from 'react';
import Button from '../../components/common/ui/Button';
import Card from '../../components/common/ui/Card';
import Input from '../../components/common/ui/Input';
import ComparisonTable from '../../components/features/ComparisonTable';
import { comparisonService } from '../../services/comparisonService';
import { GYMS_DATA } from '../../data/gymsData';
import './GymComparison.css';

const GymComparison = () => {
  const [selectedGyms, setSelectedGyms] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter gyms based on search
  const filteredGyms = GYMS_DATA.filter(
    gym =>
      gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gym.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle gym selection (toggle)
  const handleGymSelect = (gymId) => {
    if (selectedGyms.includes(gymId)) {
      // Remove gym if already selected
      setSelectedGyms(selectedGyms.filter(id => id !== gymId));
    } else {
      // Add gym only if less than 3 already selected
      if (selectedGyms.length < 3) {
        setSelectedGyms([...selectedGyms, gymId]);
      }
    }
    setError('');
  };

  // Handle comparison
  const handleCompare = async () => {
    if (selectedGyms.length < 2) {
      setError('Please select at least 2 gyms to compare');
      return;
    }

    if (selectedGyms.length > 3) {
      setError('You can compare up to 3 gyms only');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await comparisonService.compareGyms(selectedGyms);
      setComparison(response.data?.data || response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to compare gyms. Please try again.'
      );
      console.error('Comparison error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Clear selection
  const handleClear = () => {
    setSelectedGyms([]);
    setComparison(null);
    setError('');
    setSearchTerm('');
  };

  return (
    <div className="gym-comparison-page">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary/50 text-white py-12 px-4 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-2">Gym Comparison Tool</h1>
        <p className="text-lg opacity-90">
          Compare 2-3 gyms side by side to find the perfect fit for your fitness goals
        </p>
      </div>

      {/* Selection Section */}
      <div className="mb-8">
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">Search Gyms</label>
          <Input
            placeholder="Search by gym name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          />
        </div>

        {/* Gym Selection Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">
              Select Gyms to Compare ({selectedGyms.length}/3)
            </h3>
            <span className="text-sm text-textSecondary">
              Choose 2-3 gyms to compare
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGyms.map((gym) => {
              const isSelected = selectedGyms.includes(gym.id);
              return (
                <Card
                  key={gym.id}
                  className={`cursor-pointer transition-all overflow-hidden group ${
                    isSelected
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => handleGymSelect(gym.id)}
                >
                  {/* Gym Image */}
                  <div className="relative h-40 overflow-hidden bg-surfaceLight">
                    <img
                      src={
                        gym.image ||
                        'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&q=80&w=500'
                      }
                      alt={gym.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {/* Selection Badge */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                        <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center">
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Gym Info */}
                  <div className="p-4">
                    <h3 className="font-bold mb-1 truncate">{gym.name}</h3>
                    <p className="text-sm text-textSecondary mb-2 truncate">
                      {gym.location}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="font-bold text-sm">{gym.rating}</span>
                      </div>
                      <span className="text-xs text-textSecondary">
                        {gym.reviews}+ reviews
                      </span>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      ₹{gym.monthlyPrice}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleCompare}
            disabled={selectedGyms.length < 2 || loading}
            className="flex-1"
          >
            {loading ? 'Comparing...' : `Compare (${selectedGyms.length})`}
          </Button>
          <Button
            onClick={handleClear}
            variant="secondary"
            className="flex-1"
          >
            Clear Selection
          </Button>
        </div>
      </div>

      {/* Selected Gyms Preview */}
      {selectedGyms.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Selected for Comparison:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedGyms.map((gymId) => {
              const gym = GYMS_DATA.find(g => g.id === gymId);
              return (
                <Card key={gymId} className="inline-block px-4 py-2">
                  <span className="font-medium">{gym?.name}</span>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Comparison Results */}
      {comparison && (
        <div>
          <hr className="my-8" />
          <ComparisonTable comparison={comparison} />
        </div>
      )}

      {/* Empty State */}
      {!comparison && selectedGyms.length === 0 && (
        <Card className="text-center py-12">
          <svg
            className="w-16 h-16 text-textSecondary mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="text-xl font-bold mb-2">Start Comparing</h3>
          <p className="text-textSecondary mb-4">
            Select 2-3 gyms to see a detailed side-by-side comparison
          </p>
        </Card>
      )}
    </div>
  );
};

export default GymComparison;
