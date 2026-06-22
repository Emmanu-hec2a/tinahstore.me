import { useState, useEffect } from 'react';
import { api } from '../services/api.js';

export function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const data = await api.listProducts(params);
        setProducts(data.results || data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [JSON.stringify(params)]);

  return { products, isLoading, error };
}
