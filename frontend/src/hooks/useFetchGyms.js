import { useEffect, useMemo, useState } from 'react';
import gymService from '../services/gymService';

function useFetchGyms() {
  const [gyms, setGyms] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadGyms = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await gymService.getGyms(query, controller.signal);
        setGyms(data);
      } catch (err) {
        setError(err.message || 'Unable to load gyms');
      } finally {
        setLoading(false);
      }
    };

    loadGyms();

    return () => controller.abort();
  }, [query]);

  return useMemo(
    () => ({ gyms, query, setQuery, loading, error }),
    [gyms, query, loading, error]
  );
}

export default useFetchGyms;
