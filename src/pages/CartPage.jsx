import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import CakeImage from '../components/UI/CakeImage';
import { formatPeso } from '../utils/formatCurrency';
import { calculateCartPricing, FREE_DELIVERY_THRESHOLD } from '../utils/cartPricing';
import './CartPage.css';

function CartPage() {
  const {
    items,
    getTotalItems,
    getTotalPrice,
    updateQuantity,
    removeItem,
    clearCart,
    promoCode,
    setPromoCode,
    toggleCart,
  } = useCart();
  const [promoInput, setPromoInput] = useState(promoCode);
  const [promoError, setPromoError] = useState('');
  const itemCount = getTotalItems();
  const subtotal = getTotalPrice();
  const { discount, tax, deliveryFee, total } = calculateCartPricing(subtotal, promoCode);

  const applyPromo = (event) => {
    event.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (code !== 'SWEET10' && code !== 'WELCOME') {
      setPromoError('That promo code is invalid or expired.');
      return;
    }

    setPromoCode(code);
    setPromoInput(code);
    setPromoError('');
  };

  const removePromo = () => {
    setPromoCode('');
    setPromoInput('');
    setPromoError('');
  };

  return (
    <section className="page-section cart-page" aria-labelledby="cart-page-title">
      <div className="container">
        <header className="cart-page-header">
          <div>
            <p className="cart-page-eyebrow">YOUR ORDER</p>
            <h1 id="cart-page-title">Shopping Cart</h1>
            <p>{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
          </div>
          <a className="btn btn-ghost" href="#cakes">Continue Shopping</a>
        </header>

        {items.length === 0 ? (
          <div className="cart-page-empty">
            <div className="cart-page-empty-image">
              <CakeImage variant="vanilla" size="large" alt="" />
            </div>
            <h2>Your cart is empty</h2>
            <p>Browse our cakes and add something delicious.</p>
            <a className="btn btn-primary" href="#cakes">Browse Cakes</a>
          </div>
        ) : (
          <div className="cart-page-layout">
            <div className="cart-page-items-panel">
              <div className="cart-page-items-heading">
                <h2>Cart Items</h2>
                <button className="btn btn-ghost btn-sm" type="button" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>

              <div className="cart-page-items" role="list" aria-label="Items in your cart">
                {items.map(item => (
                  <article className="cart-page-item" key={item.id} role="listitem">
                    <div className="cart-page-image">
                      <CakeImage variant={item.style || 'vanilla'} image={item.image} size="small" alt={item.name} />
                    </div>
                    <div className="cart-page-item-info">
                      <h3>{item.name}</h3>
                      <p>{formatPeso(item.price)} each</p>
                      <div className="cart-page-quantity">
                        <button
                          type="button"
                          aria-label={`Decrease ${item.name} quantity`}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span aria-live="polite">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${item.name} quantity`}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="cart-page-item-total">
                      <strong>{formatPeso(item.price * item.quantity)}</strong>
                      <button
                        type="button"
                        className="cart-page-remove"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <form className="cart-page-promo" onSubmit={applyPromo}>
                <label htmlFor="cart-promo-code">Promo Code</label>
                {promoCode ? (
                  <div className="cart-page-promo-applied" role="status">
                    <span>{promoCode} applied — 10% off</span>
                    <button className="btn btn-ghost btn-sm" type="button" onClick={removePromo}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="cart-page-promo-row">
                      <input
                        id="cart-promo-code"
                        value={promoInput}
                        onChange={event => {
                          setPromoInput(event.target.value.toUpperCase());
                          setPromoError('');
                        }}
                        placeholder="Try SWEET10 or WELCOME"
                        autoComplete="off"
                      />
                      <button className="btn btn-secondary" type="submit">Apply</button>
                    </div>
                    {promoError && <p className="cart-page-promo-error" role="alert">{promoError}</p>}
                  </>
                )}
              </form>
            </div>

            <aside className="cart-page-summary" aria-label="Order summary">
              <h2>Order Summary</h2>
              <div className="cart-page-summary-row">
                <span>Subtotal ({itemCount} items)</span>
                <span>{formatPeso(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="cart-page-summary-row cart-page-discount">
                  <span>Discount ({promoCode})</span>
                  <span>−{formatPeso(discount)}</span>
                </div>
              )}
              <div className="cart-page-summary-row">
                <span>Estimated Tax (8%)</span>
                <span>{formatPeso(tax)}</span>
              </div>
              <div className="cart-page-summary-row">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'Free' : formatPeso(deliveryFee)}</span>
              </div>
              {subtotal < FREE_DELIVERY_THRESHOLD && (
                <p className="cart-page-delivery-hint">
                  Add {formatPeso(FREE_DELIVERY_THRESHOLD - subtotal)} more for free delivery.
                </p>
              )}
              <div className="cart-page-total">
                <strong>Total</strong>
                <strong>{formatPeso(total)}</strong>
              </div>
              <button className="btn btn-primary btn-lg btn-block" type="button" onClick={toggleCart}>
                Open Checkout
              </button>
              <p className="cart-page-checkout-note">Pickup date and time can be selected at checkout.</p>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

export default CartPage;
