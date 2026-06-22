import { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  // Initialize from localStorage or empty array
  const [ids, setIds] = useState(() => {
    const saved = localStorage.getItem('ts_wishlist_ids');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync with localStorage whenever ids change
  useEffect(() => {
    localStorage.setItem('ts_wishlist_ids', JSON.stringify(ids));
  }, [ids]);

  function toggle(productId) {
    setIds((current) => (current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]));
  }

  function clear() {
    setIds([]);
  }

  return (
    <WishlistContext.Provider value={{ ids, toggle, clear, count: ids.length }}>
      {children}
    </WishlistContext.Provider>
  );
}
