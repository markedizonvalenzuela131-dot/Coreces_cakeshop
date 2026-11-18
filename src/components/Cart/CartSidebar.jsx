import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import CakeImage from '../UI/CakeImage';
import { formatPeso } from '../../utils/formatCurrency';
import { calculateCartPricing } from '../../utils/cartPricing';
import './CartSidebar.css';

const CartSidebar = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    getTotalItems,
    getTotalPrice,
    updateQuantity,
    removeItem,
    clearCart,
    promoCode
  } = useCart();

  const { createOrder } = useOrders();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [checkoutStep, setCheckoutStep] = React.useState('cart');
  const [orderDetails, setOrderDetails] = React.useState({
    name: '', email: '', phone: '', pickupDate: '', pickupTime: '', notes: ''
  });
  const [orderErrors, setOrderErrors] = React.useState({});
  const [createdOrder, setCreatedOrder] = React.useState(null);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isCartOpen && checkoutStep === 'cart') {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isCartOpen, checkoutStep, closeCart]);

  if (!isCartOpen) return null;

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const { discount, tax, deliveryFee, total } = calculateCartPricing(subtotal, promoCode);

  const validateCheckout = () => {
    const errors = {};
    if (!orderDetails.name.trim()) errors.name = 'Name is required';
    if (!orderDetails.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderDetails.email)) errors.email = 'Invalid email';
    if (!orderDetails.phone.trim()) errors.phone = 'Phone is required';
    if (!orderDetails.pickupDate) errors.pickupDate = 'Pickup date is required';
    if (!orderDetails.pickupTime) errors.pickupTime = 'Pickup time is required';
    setOrderErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = () => {
    if (validateCheckout()) {
      setIsCheckingOut(true);
      setTimeout(() => {
        const order = createOrder({
          items: [...items],
          subtotal, discount, promoCode, tax, deliveryFee, total,
          customer: { ...orderDetails },
          pickupDateTime: `${orderDetails.pickupDate}T${orderDetails.pickupTime}`
        });
        setCreatedOrder(order);
        setCheckoutStep('confirmation');
        setIsCheckingOut(false);
        clearCart();
      }, 1500);
    }
  };

  const handleBackToCart = () => {
    setCheckoutStep('cart');
    setOrderDetails({ name: '', email: '', phone: '', pickupDate: '', pickupTime: '', notes: '' });
    setOrderErrors({});
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <>
      <div className="cart-overlay" onClick={checkoutStep === 'cart' ? closeCart : null} aria-hidden="true" />
      <aside className="cart-sidebar" role="dialog" aria-label="Shopping cart" aria-modal="true">
        <div className="cart-header">
          <h2 className="cart-title">Shopping Cart <span className="cart-count">{totalItems}</span></h2>
          <button className="cart-close" onClick={checkoutStep === 'cart' ? closeCart : handleBackToCart} aria-label={checkoutStep === 'cart' ? 'Close cart' : 'Back to cart'}>✕</button>
        </div>

        {checkoutStep === 'cart' && (
          <>
            <div className="cart-content">
              {items.length === 0 ? (
                <div className="cart-empty">
                  <div className="cart-empty-visual" aria-hidden="true">
                    <CakeImage variant="vanilla" size="large" alt="Empty cart" />
                  </div>
                  <h3>Your cart is empty</h3>
                  <p>Add some delicious cakes to get started!</p>
                  <button className="btn btn-primary" onClick={closeCart}>Continue Shopping</button>
                </div>
              ) : (
                <div className="cart-items" role="list" aria-label="Cart items">
                  {items.map(item => (
                    <article key={item.id} className="cart-item" role="listitem">
                      <div className="cart-item-visual" aria-hidden="true">
                        <CakeImage variant={item.style || 'vanilla'} image={item.image} size="small" alt={item.name} />
                      </div>
                      <div className="cart-item-details">
                        <h4 className="cart-item-name">{item.name}</h4>
                        <p className="cart-item-price">{formatPeso(item.price)} each</p>
                        <div className="cart-item-quantity">
                          <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity" disabled={item.quantity <= 1}>−</button>
                          <span className="qty-value">{item.quantity}</span>
                          <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">+</button>
                        </div>
                      </div>
                      <div className="cart-item-total">
                        <span className="cart-item-subtotal">{formatPeso(item.price * item.quantity)}</span>
                        <button className="cart-item-remove" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="cart-footer">
                <div className="cart-summary">
                  <div className="summary-row"><span>Subtotal ({totalItems} items)</span><span>{formatPeso(subtotal)}</span></div>
                  {discount > 0 && <div className="summary-row"><span>Discount ({promoCode})</span><span>−{formatPeso(discount)}</span></div>}
                  <div className="summary-row"><span>Estimated Tax (8%)</span><span>{formatPeso(tax)}</span></div>
                  <div className="summary-row"><span>Delivery Fee</span><span>{deliveryFee === 0 ? 'Free' : formatPeso(deliveryFee)}</span></div>
                  {subtotal < 5600 && <p className="free-delivery-hint">Add {formatPeso(5600 - subtotal)} more for free delivery!</p>}
                  <div className="summary-row total"><span>Total</span><span>{formatPeso(total)}</span></div>
                </div>
                <button className="btn btn-primary btn-lg btn-block checkout-btn" onClick={() => setCheckoutStep('details')} disabled={isCheckingOut}>Proceed to Checkout</button>
                <a className="cart-full-page-link" href="#cart" onClick={closeCart}>View full cart</a>
                {items.length > 1 && <button className="btn btn-secondary btn-sm btn-block clear-cart-btn" onClick={clearCart}>Clear Cart</button>}
              </div>
            )}
          </>
        )}

        {checkoutStep === 'details' && (
          <div className="cart-content checkout-form">
            <h3 className="checkout-title">Checkout Details</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleCheckout(); }}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="checkout-name" className="form-label">Full Name *</label>
                  <input id="checkout-name" type="text" className="form-input" value={orderDetails.name} onChange={(e) => setOrderDetails(prev => ({ ...prev, name: e.target.value }))} placeholder="John Doe" required aria-invalid={!!orderErrors.name} aria-describedby={orderErrors.name ? 'name-error' : undefined} />
                  {orderErrors.name && <p id="name-error" className="form-error">{orderErrors.name}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="checkout-email" className="form-label">Email *</label>
                  <input id="checkout-email" type="email" className="form-input" value={orderDetails.email} onChange={(e) => setOrderDetails(prev => ({ ...prev, email: e.target.value }))} placeholder="john@example.com" required aria-invalid={!!orderErrors.email} aria-describedby={orderErrors.email ? 'email-error' : undefined} />
                  {orderErrors.email && <p id="email-error" className="form-error">{orderErrors.email}</p>}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="checkout-phone" className="form-label">Phone Number *</label>
                <input id="checkout-phone" type="tel" className="form-input" value={orderDetails.phone} onChange={(e) => setOrderDetails(prev => ({ ...prev, phone: e.target.value }))} placeholder="(555) 123-4567" required aria-invalid={!!orderErrors.phone} aria-describedby={orderErrors.phone ? 'phone-error' : undefined} />
                {orderErrors.phone && <p id="phone-error" className="form-error">{orderErrors.phone}</p>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="checkout-date" className="form-label">Pickup Date *</label>
                  <input id="checkout-date" type="date" className="form-input" value={orderDetails.pickupDate} onChange={(e) => setOrderDetails(prev => ({ ...prev, pickupDate: e.target.value, pickupTime: '' }))} min={minDate} max={maxDate} required aria-invalid={!!orderErrors.pickupDate} aria-describedby={orderErrors.pickupDate ? 'date-error' : undefined} />
                  {orderErrors.pickupDate && <p id="date-error" className="form-error">{orderErrors.pickupDate}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="checkout-time" className="form-label">Pickup Time *</label>
                  <select id="checkout-time" className="form-input" value={orderDetails.pickupTime} onChange={(e) => setOrderDetails(prev => ({ ...prev, pickupTime: e.target.value }))} required aria-invalid={!!orderErrors.pickupTime} aria-describedby={orderErrors.pickupTime ? 'time-error' : undefined} disabled={!orderDetails.pickupDate}>
                    <option value="">Select time</option>
                    {timeSlots.map(time => <option key={time} value={time}>{time}</option>)}
                  </select>
                  {orderErrors.pickupTime && <p id="time-error" className="form-error">{orderErrors.pickupTime}</p>}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="checkout-notes" className="form-label">Special Instructions</label>
                <textarea id="checkout-notes" className="form-input form-textarea" value={orderDetails.notes} onChange={(e) => setOrderDetails(prev => ({ ...prev, notes: e.target.value }))} placeholder="Any allergies, custom messages, or special requests..." rows={3} />
              </div>
              <div className="order-summary-mini">
                <h4>Order Summary</h4>
                <div className="summary-row"><span>{totalItems} items</span><span>{formatPeso(subtotal)}</span></div>
                <div className="summary-row total"><span>Total</span><span>{formatPeso(total)}</span></div>
              </div>
              <div className="checkout-actions">
                <button type="button" className="btn btn-secondary btn-block" onClick={handleBackToCart}>Back to Cart</button>
                <button type="submit" className="btn btn-primary btn-block" disabled={isCheckingOut}>{isCheckingOut ? 'Processing...' : `Place Order - ${formatPeso(total)}`}</button>
              </div>
            </form>
          </div>
        )}

        {checkoutStep === 'confirmation' && createdOrder && (
          <div className="cart-content confirmation">
            <div className="confirmation-visual" aria-hidden="true">
              <CakeImage variant="wedding" size="large" alt="Order confirmed" />
              <div className="checkmark" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            </div>
            <h3 className="confirmation-title">Order Confirmed!</h3>
            <p className="confirmation-message">Thank you for your order. Your cakes will be ready for pickup.</p>
            <div className="confirmation-details">
              <div className="confirmation-row"><span className="confirmation-label">Order Number</span><span className="confirmation-value">{createdOrder.id}</span></div>
              <div className="confirmation-row"><span className="confirmation-label">Pickup Date</span><span className="confirmation-value">{formatDate(createdOrder.customer.pickupDate)}</span></div>
              <div className="confirmation-row"><span className="confirmation-label">Pickup Time</span><span className="confirmation-value">{createdOrder.customer.pickupTime}</span></div>
              <div className="confirmation-row"><span className="confirmation-label">Total Paid</span><span className="confirmation-value">{formatPeso(createdOrder.total)}</span></div>
              <div className="confirmation-row"><span className="confirmation-label">Status</span><span className="confirmation-value badge badge-info">{createdOrder.status}</span></div>
            </div>
            <p className="confirmation-email">A confirmation email has been sent to <strong>{createdOrder.customer.email}</strong></p>
            <button className="btn btn-primary btn-block" onClick={() => { handleBackToCart(); closeCart(); }}>Continue Shopping</button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartSidebar;