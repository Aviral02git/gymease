import React, { useMemo, useState } from 'react';
import SearchBar from '../../components/common/SearchBar';
import GymCard from '../../components/common/GymCard';
import Button from '../../components/common/ui/Button';
import ComparisonModal from '../../components/features/ComparisonModal';
import { GYMS_DATA } from '../../data/gymsData';
import { distanceInKm, formatINR } from '../../utils/helpers';
import { discoveryService } from '../../services/discoveryService';
import { osmGymService } from '../../services/osmGymService';

const PLAN_FILTERS = ['All', 'Lite', 'Prime', 'Platinum'];

const FindGyms = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(7000);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(7000);
  const [distanceLimit, setDistanceLimit] = useState(10);
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [locationStatus, setLocationStatus] = useState('Use nearby');
  const [externalGyms, setExternalGyms] = useState([]);
  const [discoverStatus, setDiscoverStatus] = useState('');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [compareGyms, setCompareGyms] = useState([]);

  const allGyms = useMemo(() => {
    const seen = new Map();
    [...GYMS_DATA, ...externalGyms].forEach((gym) => {
      if (!seen.has(gym.id)) {
        seen.set(gym.id, gym);
      }
    });
    return Array.from(seen.values());
  }, [externalGyms]);

  const gymsWithDistance = useMemo(() => {
    if (!userCoords) {
      return allGyms;
    }

    return allGyms.map((gym) => ({
      ...gym,
      computedDistanceKm: distanceInKm(userCoords.latitude, userCoords.longitude, gym.latitude, gym.longitude)
    }));
  }, [userCoords, allGyms]);

  const discoverFromMap = async () => {
    try {
      setIsDiscovering(true);
      setDiscoverStatus('Searching from OpenStreetMap & Foursquare...');

      let discovered = [];

      if (userCoords) {
        // Use hybrid search (OSM + Foursquare) for nearby gyms based on user location
        discovered = await osmGymService.hybridGymSearch(
          userCoords.latitude,
          userCoords.longitude,
          30000,
          50
        );
        setDiscoverStatus(`Found ${discovered.length} gyms from OSM & Foursquare nearby.`);
      } else if (locationQuery.trim()) {
        // Search by city name using hybrid search
        discovered = await osmGymService.hybridCitySearch(locationQuery.trim(), 50);
        setDiscoverStatus(`Found ${discovered.length} gyms in ${locationQuery} from OSM & Foursquare.`);
      } else {
        setDiscoverStatus('Please enable location or enter a city name.');
      }

      setExternalGyms(discovered);
    } catch (error) {
      console.error('Error discovering gyms:', error);
      setDiscoverStatus('Could not fetch gyms right now. Showing platform data only.');
    } finally {
      setIsDiscovering(false);
    }
  };

  const filteredGyms = useMemo(
    () =>
      gymsWithDistance.filter((gym) => {
        const textMatch =
          gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          gym.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          gym.city.toLowerCase().includes(searchTerm.toLowerCase());

        const locationMatch =
          !locationQuery.trim() ||
          gym.location.toLowerCase().includes(locationQuery.toLowerCase()) ||
          gym.city.toLowerCase().includes(locationQuery.toLowerCase()) ||
          gym.state.toLowerCase().includes(locationQuery.toLowerCase());

        const tierMatch = selectedTier === 'All' || gym.tier === selectedTier;
        const priceMatch = gym.monthlyPrice <= appliedMaxPrice;

        const nearbyMatch =
          !nearbyOnly ||
          (typeof gym.computedDistanceKm === 'number' && gym.computedDistanceKm <= distanceLimit);

        return textMatch && locationMatch && tierMatch && priceMatch && nearbyMatch;
      }),
    [gymsWithDistance, searchTerm, locationQuery, selectedTier, appliedMaxPrice, nearbyOnly, distanceLimit]
  );

  const detectNearby = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation not supported');
      return;
    }

    setLocationStatus('Detecting location...');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setUserCoords(coords);
        setNearbyOnly(true);
        setLocationStatus('Location enabled ✓');

        // Auto-fetch nearby gyms from OpenStreetMap & Foursquare
        try {
          setIsDiscovering(true);
          setDiscoverStatus('Fetching nearby gyms from OSM & Foursquare...');
          const discovered = await osmGymService.hybridGymSearch(
            coords.latitude,
            coords.longitude,
            30000,
            50
          );
          setExternalGyms(discovered);
          setDiscoverStatus(`Found ${discovered.length} gyms nearby from OSM & Foursquare.`);
        } catch (error) {
          console.error('Error fetching nearby gyms:', error);
          setDiscoverStatus('Could not fetch nearby gyms.');
        } finally {
          setIsDiscovering(false);
        }
      },
      () => {
        setLocationStatus('Permission denied');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="animate-fade-in flex flex-col md:flex-row gap-8 min-h-screen">
      <aside className="w-full md:w-72 flex-shrink-0 space-y-6">
        <div className="sticky top-20 bg-surface p-6 border border-white/5 rounded-2xl">
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-6">Discover Filters</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-bold text-textMuted uppercase tracking-widest mb-3">Search Location</h3>
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Mumbai, Bengaluru, Pune..."
                className="input-field"
              />
              <div className="grid grid-cols-2 gap-2 mt-3">
                <Button variant="secondary" size="sm" className="w-full" onClick={detectNearby} uppercase={false}>
                  Use Nearby
                </Button>
                <Button
                  variant={nearbyOnly ? 'primary' : 'ghost'}
                  size="sm"
                  className="w-full"
                  onClick={() => setNearbyOnly((prev) => !prev)}
                  uppercase={false}
                >
                  {nearbyOnly ? 'Nearby On' : 'Nearby Off'}
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2"
                onClick={discoverFromMap}
                uppercase={false}
                disabled={isDiscovering}
              >
                {isDiscovering ? 'Importing...' : 'Import from Maps'}
              </Button>
              <p className="text-xs text-textMuted mt-2">{locationStatus}</p>
              {discoverStatus && <p className="text-xs text-primary mt-1">{discoverStatus}</p>}
            </div>

            <div>
              <h3 className="text-xs font-bold text-textMuted uppercase tracking-widest mb-3">Gym Category</h3>
              <div className="grid grid-cols-2 gap-2">
                {PLAN_FILTERS.map((tier) => (
                  <button
                    key={tier}
                    className={`px-3 py-2 text-xs font-bold rounded-lg border transition-colors ${
                      selectedTier === tier
                        ? 'bg-primary text-white border-primary'
                        : 'text-textMuted border-white/10 hover:text-white'
                    }`}
                    onClick={() => setSelectedTier(tier)}
                    type="button"
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-textMuted uppercase tracking-widest mb-3">Max Price</h3>
              <input
                type="range"
                className="w-full h-2 bg-surfaceLight rounded-lg appearance-none cursor-pointer accent-primary"
                min="1000"
                max="7000"
                step="100"
                value={selectedMaxPrice}
                onChange={(e) => setSelectedMaxPrice(Number(e.target.value))}
              />
              <div className="flex justify-between text-xs font-bold text-textMuted mt-2">
                <span>{formatINR(1000)}</span>
                <span>{formatINR(7000)}+</span>
              </div>
              <p className="text-xs text-white mt-2">Selected: {formatINR(selectedMaxPrice)}</p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-textMuted uppercase tracking-widest mb-3">Nearby Distance</h3>
              <select
                className="input-field py-2 text-sm bg-surface"
                value={distanceLimit}
                onChange={(e) => setDistanceLimit(Number(e.target.value))}
              >
                <option value={5}>Within 5 km</option>
                <option value={10}>Within 10 km</option>
                <option value={20}>Within 20 km</option>
                <option value={50}>Within 50 km</option>
              </select>
            </div>

            <Button className="w-full mt-4" onClick={() => setAppliedMaxPrice(selectedMaxPrice)}>
              Apply Filters
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-grow space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-surface p-4 border border-white/5 rounded-2xl">
          <div className="w-full md:w-1/2">
            <SearchBar onSearch={setSearchTerm} />
          </div>
          <div className="text-sm font-bold uppercase tracking-wider text-textMuted">
            <span className="text-white">{filteredGyms.length}</span> Results ({externalGyms.length} from maps)
          </div>
        </div>

        {filteredGyms.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredGyms.map(gym => (
              <GymCard
                key={gym.id}
                {...gym}
                onCompare={(selectedGym) => {
                  setCompareGyms(prev => {
                    const alreadySelected = prev.find(g => g.id === selectedGym.id);
                    if (alreadySelected) {
                      // Remove if already selected
                      return prev.filter(g => g.id !== selectedGym.id);
                    }
                    // Add if not selected and we have less than 3
                    if (prev.length < 3) {
                      return [...prev, selectedGym];
                    }
                    return prev;
                  });
                  setIsComparisonModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface/30 rounded-xl border border-white/5">
            <svg className="w-16 h-16 text-textMuted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">No gyms found</h3>
            <p className="text-textMuted">Try another location, tier, or distance.</p>
          </div>
        )}
      </div>

      {isComparisonModalOpen && (
        <ComparisonModal
          gyms={compareGyms}
          allGyms={filteredGyms}
          onClose={() => setIsComparisonModalOpen(false)}
        />
      )}
    </div>
  );
};

export default FindGyms;
