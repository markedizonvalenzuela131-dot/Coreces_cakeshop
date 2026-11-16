import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { products } from '../data/products';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('coreces-cart');
    if (!saved) return [];
    return JSON.parse(saved).map(item => {
      const product = products.find(catalogProduct => catalogProduct.id === item.id);
      return product
        ? { ...product, ...item, price: product.price, originalPrice: product.originalPrice, image: product.image }
        : item;
    });
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const notificationTimer = useRef(null);
  const notificationId = useRef(0);

  useEffect(() => {
    localStorage.setItem('coreces-cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => () => clearTimeout(notificationTimer.current), []);

  const showNotification = useCallback((message, type = 'info') => {
    const nextNotification = { message, type, id: ++notificationId.current };
    clearTimeout(notificationTimer.current);
    setNotification(nextNotification);
    notificationTimer.current = setTimeout(() => {
      setNotification(current => current?.id === nextNotification.id ? null : current);
    }, 5000);
  }, []);

  const addItem = useCallback((product, quantity = 1) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { ...product, quantity }];
    });
    showNotification(`${product.name} added to cart!`, 'success');
  }, [showNotification]);

  const removeItem = useCallback((productId) => {
    setItems(prev => prev.filter(item => item.id !== productId));
    showNotification('Item removed from cart', 'info');
  }, [showNotification]);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    showNotification('Cart cleared', 'info');
  }, [showNotification]);

  const getTotalItems = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [items]);

  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => !prev);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const value = {
    items,
    isCartOpen,
    notification,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    toggleCart,
    closeCart,
    showNotification
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};