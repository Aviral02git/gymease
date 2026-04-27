import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/ui/Button';
import Card from '../../components/common/ui/Card';
import { GYMS_DATA } from '../../data/gymsData';
import { formatINR } from '../../utils/helpers';
import { discoveryService } from '../../services/discoveryService';

const TIERS = ['All', 'Lite', 'Prime', 'Platinum'];

const FeaturedLocations = () => {
  const [tierFilter, setTierFilter] = useState('All');
  const [externalGyms, setExternalGyms] = useState([]);

  useEffect(() => {
    let active = true;

    const loadMapPlaces = async () => {
      try {
        const [mumbai, bengaluru, delhi] = await Promise.all([
          discoveryService.discoverPlaces({ city: 'Mumbai', limit: 20, radius: 20000 }),
          discoveryService.discoverPlaces({ city: 'Bengaluru', limit: 20, radius: 20000 }),
          discoveryService.discoverPlaces({ city: 'Delhi', limit: 20, radius: 20000 })
        ]);

        if (!active) return;

        const merged = [...mumbai, ...bengaluru, ...delhi];
        const unique = new Map();
        merged.forEach((gym) => {
          if (!unique.has(gym.id)) unique.set(gym.id, gym);
        });
        setExternalGyms(Array.from(unique.values()));
      } catch {
        if (active) setExternalGyms([]);
      }
    };

    loadMapPlaces();

    return () => {
      active = false;
    };
  }, []);

  const allGyms = useMemo(() => {
    const unique = new Map();
    [...GYMS_DATA, ...externalGyms].forEach((gym) => {
      if (!unique.has(gym.id)) unique.set(gym.id, gym);
    });
    return Array.from(unique.values());
  }, [externalGyms]);

  const tiered = useMemo(
    () =>
      allGyms.filter((gym) => tierFilter === 'All' || gym.tier === tierFilter),
    [tierFilter, allGyms]
  );

  const primeLocations = useMemo(
    () => tiered.filter((gym) => gym.isPrimeLocation).slice(0, 4),
    [tiered]
  );

  const mostViewed = useMemo(
    () => [...tiered].sort((a, b) => b.viewsPerMonth - a.viewsPerMonth).slice(0, 4),
    [tiered]
  );

  const busyLocations = useMemo(
    () => [...tiered].sort((a, b) => b.peakOccupancy - a.peakOccupancy).slice(0, 4),
    [tiered]
  );

  const renderGymGroup = (title, gyms, metricLabel, metricKey) => (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">{title}</h2>
        <span className="text-xs uppercase text-textMuted tracking-widest">{gyms.length} gyms</span>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {gyms.map((gym) => (
          <Card key={`${title}-${gym.id}`} className="p-5">
            <h3 className="text-lg font-black text-white uppercase italic leading-tight mb-2">{gym.name}</h3>
            <p className="text-sm text-textMuted mb-3">{gym.location}</p>
            <div className="flex items-center justify-between text-xs uppercase tracking-wider mb-3">
              <span className="text-primary font-bold">{gym.tier}</span>
              <span className="text-textMuted">{metricLabel}: <span className="text-white">{gym[metricKey]}</span></span>
            </div>
            <p className="text-white font-semibold mb-4">Starts {formatINR(gym.monthlyPrice)}/mo</p>
            <Link to={`/gyms/${gym.id}`}>
              <Button size="sm" className="w-full">Explore</Button>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );

  return (
    <div className="animate-fade-in space-y-10 pb-16">
      <header className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tight">Featured Locations</h1>
        <p className="text-textMuted max-w-3xl">
          Explore high-demand gyms by popularity, traffic, and premium city zones. Filter by membership category to discover Lite, Prime, and Platinum picks.
        </p>
        <p className="text-xs uppercase tracking-widest text-primary">Total places shown: {allGyms.length}</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {TIERS.map((tier) => (
          <button
            key={tier}
            onClick={() => setTierFilter(tier)}
            type="button"
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors ${
              tierFilter === tier ? 'bg-primary border-primary text-white' : 'border-white/10 text-textMuted hover:text-white'
            }`}
          >
            {tier}
          </button>
        ))}
      </div>

      {renderGymGroup('Prime Locations', primeLocations, 'Rating', 'rating')}
      {renderGymGroup('Most Viewed Gyms', mostViewed, 'Views', 'viewsPerMonth')}
      {renderGymGroup('Busy Hotspots', busyLocations, 'Peak %', 'peakOccupancy')}
    </div>
  );
};

export default FeaturedLocations;
