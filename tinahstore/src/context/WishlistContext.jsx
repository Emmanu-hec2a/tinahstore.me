import { createContext, useState } from 'react';

export const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState([1, 2]);

  function toggle(productId) {
    setIds((current) => (current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]));
  }

  return <WishlistContext.Provider value={{ ids, toggle, count: ids.length }}>{children}</WishlistContext.Provider>;
}
