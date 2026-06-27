import { createContext, useMemo, useState, useEffect } from 'react';
import { initialCart } from '../data/products.js';

export const CartContext = createContext(null);
const defaultDeliveryFee = 89;

export function CartProvider({ children }) {
  // Load initial cart from localStorage if available
  const [items, setItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('ts_cart');
      return savedCart ? JSON.parse(savedCart) : initialCart;
    } catch (err) {
      console.error('Failed to load cart from localStorage', err);
      return initialCart;
    }
  });

  const [deliveryFee, setDeliveryFee] = useState(defaultDeliveryFee);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ts_cart', JSON.stringify(items));
  }, [items]);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + (items.length ? deliveryFee : 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  function addItem(product, options = {}) {
    setItems((current) => {
      // Find if item with same ID, color and size already exists
      const match = current.find((item) =>
        item.productId === product.id &&
        item.color === (options.color || product.color_name) &&
        item.size === (options.size || product.size || '')
      );

      if (match) {
        return current.map((item) =>
          item === match
            ? { ...item, quantity: Math.min(item.quantity + (options.quantity || 1), 10) }
            : item
        );
      }

      return [...current, {
        productId: product.id,
        product: product, // Store full product object to avoid lookup
        quantity: options.quantity || 1,
        color: options.color || product.color_name,
        size: options.size || product.size || ''
      }];
    });
  }

  function updateQuantity(productId, quantity) {
    setItems((current) => current.map((item) => (item.productId === productId ? { ...item, quantity: Math.max(1, Math.min(quantity, 10)) } : item)));
  }

  function removeItem(productId) {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }

  function clear() {
    setItems([]);
  }

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clear, subtotal, deliveryFee, setDeliveryFee, total, count }}>
      {children}
    </CartContext.Provider>
  );
}
