import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Controller hook for fetching and filtering services
 */
export const useServices = (initialCategory = 'All', initialSearch = '') => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (category && category !== 'All') params.category = category;
      if (search.trim()) params.search = search.trim();

      const res = await api.getServices(params);
      if (res.success && res.data) {
        setServices(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    loading,
    error,
    category,
    setCategory,
    search,
    setSearch,
    refresh: fetchServices,
  };
};

/**
 * Controller hook for fetching and filtering mistris (technicians)
 */
export const useMistris = (initialCity = '', initialProfession = '') => {
  const [mistris, setMistris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(initialCity);
  const [profession, setProfession] = useState(initialProfession);
  const [search, setSearch] = useState('');

  const fetchMistris = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (city) params.city = city;
      if (profession) params.profession = profession;
      if (search.trim()) params.search = search.trim();

      const res = await api.getMistris(params);
      if (res.success && res.data) {
        setMistris(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch mistris');
    } finally {
      setLoading(false);
    }
  }, [city, profession, search]);

  useEffect(() => {
    fetchMistris();
  }, [fetchMistris]);

  return {
    mistris,
    loading,
    error,
    city,
    setCity,
    profession,
    setProfession,
    search,
    setSearch,
    refresh: fetchMistris,
  };
};
