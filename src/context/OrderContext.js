import React, { createContext, useContext, useState, useCallback } from 'react';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'preparing',
  'ready_for_pickup',
  'completed',
  'cancelled'
];

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready_for_pickup: 'Ready for Pickup',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

const STATUS_COLORS = {
  pending: 'badge-warning',
  confirmed: 'badge-info',
  preparing: 'badge-primary',
  ready_for_pickup: 'badge-success',
  completed: 'badge-success',
  cancelled: 'badge-danger'
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('coreces-orders');
    return saved ? JSON.parse(saved) : [];
  });

  const createOrder = useCallback((orderData) => {
    const newOrder = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      ...orderData,
      status: 'pending',
      statusHistory: [{ status: 'pending', timestamp: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const currentIndex = ORDER_STATUSES.indexOf(order.status);
        const newIndex = ORDER_STATUSES.indexOf(newStatus);
        if (newIndex >= currentIndex || newStatus === 'cancelled') {
          return {
            ...order,
            status: newStatus,
            statusHistory: [...order.statusHistory, { status: newStatus, timestamp: new Date().toISOString() }],
            updatedAt: new Date().toISOString()
          };
        }
      }
      return order;
    }));
  }, []);

  const getOrder = useCallback((orderId) => {
    return orders.find(order => order.id === orderId);
  }, [orders]);

  const getOrdersByStatus = useCallback((status) => {
    return orders.filter(order => order.status === status);
  }, [orders]);

  const cancelOrder = useCallback((orderId) => {
    updateOrderStatus(orderId, 'cancelled');
  }, [updateOrderStatus]);

  const value = {
    orders,
    createOrder,
    updateOrderStatus,
    getOrder,
    getOrdersByStatus,
    cancelOrder,
    ORDER_STATUSES,
    STATUS_LABELS,
    STATUS_COLORS
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};