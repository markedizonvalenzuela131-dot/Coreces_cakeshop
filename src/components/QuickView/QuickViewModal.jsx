import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { getProductById, getRelatedProducts } from '../../data/products';
import { formatPeso } from '../../utils/formatCurrency';
import CakePhoto from '../UI/CakePhoto';
import './QuickViewModal.css';

const QuickViewModal = ({ productId, isOpen, onClose }) => {
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (isOpen && productId) {
      const found = getProductById(productId);
      setProduct(found);
      if (found) {
        setRelatedProducts(getRelatedProducts(found.id, found.category, 4));
        setQuantity(1);
        setSelectedOption('');
      }
    }
  }, [isOpen, productId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    setIsAdding(true);
    const productData = { ...product, quantity, selectedOption };
    addItem(productData, quantity);
    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 500);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="quickview-title">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close quick view">✕</button>

        <div className="modal-content">
          <div className="modal-gallery">
            <CakePhoto className="quickview-photo" src={product.image} alt={product.name} />
          </div>

          <div className="modal-info">
            <span className="product-category">{product.category}</span>
            <h2 id="quickview-title" className="modal-title">{product.name}</h2>

            <div className="modal-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`star ${i < Math.floor(product.rating) ? 'filled' : ''}`}>★</span>
                ))}
              </div>
              <span className="rating-value">{product.rating}</span>
              <span className="rating-count">({product.reviews} reviews)</span>
            </div>

            <p className="modal-description">{product.description}</p>

            <div className="modal-details">
              {product.details.map((detail, i) => (
                <div key={i} className="detail-item">
                  <span className="detail-icon">✓</span>
                  <span>{detail}</span>
                </div>
              ))}
            </div>

            {product.originalPrice && (
              <div className="modal-price-row">
                <span className="modal-price">{formatPeso(product.price)}</span>
                <span className="modal-original-price">{formatPeso(product.originalPrice)}</span>
                <span className="modal-save">Save {Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
              </div>
            )}

            {!product.originalPrice && (
              <div className="modal-price-row">
                <span className="modal-price">{formatPeso(product.price)}</span>
              </div>
            )}

            {product.prepTime && (
              <div className="modal-prep-time">
                <span className="prep-icon">⏱️</span>
                <span>Preparation time: {product.prepTime}</span>
              </div>
            )}

            {!product.inStock && (
              <div className="out-of-stock-notice">
                Currently out of stock. Please check back later!
              </div>
            )}

            {product.inStock && (
              <div className="modal-actions">
                <div className="quantity-selector">
                  <label htmlFor="modal-qty" className="qty-label">Quantity</label>
                  <div className="qty-controls">
                    <button
                      className="qty-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Decrease quantity"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <input
                      id="modal-qty"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="qty-input"
                      min="1"
                      max="20"
                    />
                    <button
                      className="qty-btn"
                      onClick={() => setQuantity(Math.min(20, quantity + 1))}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-lg btn-block add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={isAdding || !product.inStock}
                >
                  {isAdding ? 'Adding...' : `Add to Cart - ${formatPeso(product.price * quantity)}`}
                </button>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="modal-related">
            <h3 className="related-title">You May Also Like</h3>
            <div className="related-grid">
              {relatedProducts.map(related => (
                <button
                  key={related.id}
                  className="related-item"
                  onClick={() => {
                    // In a real app, this would update the productId prop
                    console.log('View related:', related.id);
                  }}
                >
                  <CakePhoto className="related-image" src={related.image} alt="" />
                  <div className="related-info">
                    <h4 className="related-name">{related.name}</h4>
                    <span className="related-price">{formatPeso(related.price)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickViewModal;