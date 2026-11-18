import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import CakeImage from '../UI/CakeImage';
import { formatPeso } from '../../utils/formatCurrency';
import './OrderStatus.css';

const OrderStatus = () => {
  const { orders, getOrder, STATUS_LABELS, STATUS_COLORS } = useOrders();
  const [orderId, setOrderId] = useState('');
  const [foundOrder, setFoundOrder] = useState(null);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('track');

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');
    if (!orderId.trim()) {
      setError('Please enter an order number');
      return;
    }
    setIsSearching(true);
    setTimeout(() => {
      const order = getOrder(orderId.trim().toUpperCase());
      if (order) {
        setFoundOrder(order);
        setError('');
      } else {
        setFoundOrder(null);
        setError('Order not found. Please check your order number.');
      }
      setIsSearching(false);
    }, 800);
  };

  const getStatusIndex = (status) => {
    const statuses = ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'completed', 'cancelled'];
    return statuses.indexOf(status);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'var(--text-light)',
      confirmed: 'var(--primary-color)',
      preparing: 'var(--primary-color)',
      ready_for_pickup: '#10b981',
      completed: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || colors.pending;
  };

  const icons = {
    calendar: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    clock: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    email: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    phone: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    note: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  };

  if (activeTab === 'history' && orders.length > 0) {
    return (
      <section className="order-status" id="order-status" aria-labelledby="order-status-heading">
        <div className="container">
          <header className="section-header">
            <h2 id="order-status-heading" className="section-title">Order History</h2>
            <p className="section-subtitle">View all your past orders and their current status</p>
          </header>

          <div className="order-tabs">
            <button className={`tab-btn ${activeTab === 'track' ? 'active' : ''}`} onClick={() => { setActiveTab('track'); setFoundOrder(null); setOrderId(''); }}>Track Order</button>
            <button className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>Order History</button>
          </div>

          <div className="orders-list">
            {orders.map(order => (
              <article key={order.id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <h3 className="order-card-id">{order.id}</h3>
                    <p className="order-card-date">Placed: {formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`badge ${STATUS_COLORS[order.status]}`}>{STATUS_LABELS[order.status]}</span>
                </div>
                <div className="order-card-summary">
                  <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                  <span className="order-card-total">{formatPeso(order.total)}</span>
                </div>
                <div className="order-card-progress">
                  <div className="progress-bar">
                    {['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'completed'].map((status, index) => (
                      <div key={status} className={`progress-step ${getStatusIndex(order.status) >= index ? 'completed' : ''} ${getStatusIndex(order.status) === index ? 'current' : ''}`}>
                        <div className="step-dot"></div>
                        <span className="step-label">{STATUS_LABELS[status]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {orders.length === 0 && (
            <div className="no-orders">
              <div className="no-orders-visual" aria-hidden="true"><CakeImage variant="vanilla" size="large" alt="No orders" /></div>
              <h3>No orders yet</h3>
              <p>Your order history will appear here</p>
              <button className="btn btn-primary" onClick={() => setActiveTab('track')}>Shop Cakes</button>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="order-status" id="order-status" aria-labelledby="order-status-heading">
      <div className="container">
        <header className="section-header">
          <h2 id="order-status-heading" className="section-title">Track Your Order</h2>
          <p className="section-subtitle">Enter your order number to see real-time status updates</p>
        </header>

        <div className="order-tabs">
          <button className={`tab-btn ${activeTab === 'track' ? 'active' : ''}`} onClick={() => { setActiveTab('track'); setFoundOrder(null); }}>Track Order</button>
          {orders.length > 0 && <button className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>Order History</button>}
        </div>

        <form onSubmit={handleSearch} className="track-form" noValidate>
          <div className="search-wrapper">
            <label htmlFor="order-number" className="visually-hidden">Order Number</label>
            <input id="order-number" type="text" value={orderId} onChange={(e) => { setOrderId(e.target.value.toUpperCase()); setError(''); }} placeholder="Enter order number (e.g., ORD-1234567890-ABCDE)" className="track-input" disabled={isSearching} autoComplete="off" required />
            <button type="submit" className="track-btn" disabled={isSearching || !orderId.trim()}>{isSearching ? 'Searching...' : 'Track'}</button>
          </div>
          {error && <p className="track-error" role="alert">{error}</p>}
        </form>

        {foundOrder && (
          <div className="order-details" role="region" aria-label="Order details">
            <div className="order-header">
              <div>
                <h3 className="order-id">{foundOrder.id}</h3>
                <p className="order-date">Placed on {formatDate(foundOrder.createdAt)}</p>
              </div>
              <span className={`badge ${STATUS_COLORS[foundOrder.status]} status-badge-large`}>{STATUS_LABELS[foundOrder.status]}</span>
            </div>

            <div className="order-progress">
              {['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'completed'].map((status, index) => {
                const currentIndex = getStatusIndex(foundOrder.status);
                const isCompleted = currentIndex >= index;
                const isCurrent = currentIndex === index;
                const isCancelled = foundOrder.status === 'cancelled';

                return (
                  <div key={status} className={`progress-step ${isCompleted ? 'completed' : ''} ${isCurrent && !isCancelled ? 'current' : ''} ${isCancelled && index > 0 ? 'cancelled' : ''}`}>
                    <div className="step-connector"></div>
                    <div className="step-circle" style={{ background: isCompleted || isCurrent ? getStatusColor(status) : 'var(--border-color)' }}>
                      {isCompleted ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> : (index + 1)}
                    </div>
                    <span className="step-label">{STATUS_LABELS[status]}</span>
                    {isCurrent && !isCancelled && <span className="step-current">Current</span>}
                  </div>
                );
              })}
            </div>

            <div className="order-info-grid">
              <div className="order-info-card">
                <h4>Pickup Details</h4>
                <div className="info-item"><span className="info-icon">{icons.calendar}</span><div><strong>Date:</strong> {formatDate(foundOrder.customer.pickupDate).split(',')[0]}</div></div>
                <div className="info-item"><span className="info-icon">{icons.clock}</span><div><strong>Time:</strong> {foundOrder.customer.pickupTime}</div></div>
                {foundOrder.customer.notes && <div className="info-item"><span className="info-icon">{icons.note}</span><div><strong>Notes:</strong> {foundOrder.customer.notes}</div></div>}
              </div>

              <div className="order-info-card">
                <h4>Customer Info</h4>
                <div className="info-item"><span className="info-icon">{icons.user}</span><div><strong>Name:</strong> {foundOrder.customer.name}</div></div>
                <div className="info-item"><span className="info-icon">{icons.email}</span><div><strong>Email:</strong> {foundOrder.customer.email}</div></div>
                <div className="info-item"><span className="info-icon">{icons.phone}</span><div><strong>Phone:</strong> {foundOrder.customer.phone}</div></div>
              </div>

              <div className="order-info-card">
                <h4>Order Items</h4>
                {foundOrder.items.map(item => (
                  <div key={item.id} className="order-item-mini">
                    <div className="item-visual" aria-hidden="true"><CakeImage variant={item.style || 'vanilla'} image={item.image} size="small" alt={item.name} /></div>
                    <div className="item-details">
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="item-price">{formatPeso(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="order-info-card totals">
                <h4>Order Summary</h4>
                <div className="totals-row"><span>Subtotal</span><span>{formatPeso(foundOrder.subtotal)}</span></div>
                {foundOrder.discount > 0 && <div className="totals-row"><span>Discount ({foundOrder.promoCode})</span><span>−{formatPeso(foundOrder.discount)}</span></div>}
                <div className="totals-row"><span>Tax (8%)</span><span>{formatPeso(foundOrder.tax)}</span></div>
                <div className="totals-row"><span>Delivery</span><span>{foundOrder.deliveryFee === 0 ? 'Free' : formatPeso(foundOrder.deliveryFee)}</span></div>
                <div className="totals-row total"><span>Total</span><span>{formatPeso(foundOrder.total)}</span></div>
              </div>
            </div>

            {foundOrder.statusHistory && foundOrder.statusHistory.length > 1 && (
              <div className="order-timeline">
                <h4>Status History</h4>
                <div className="timeline">
                  {foundOrder.statusHistory.slice().reverse().map((entry, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <span className="timeline-status">{STATUS_LABELS[entry.status]}</span>
                        <span className="timeline-time">{formatDate(entry.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default OrderStatus;