import React from 'react';
import { useCart } from '../../context/CartContext';
import CakeImage from '../UI/CakeImage';
import { formatPeso } from '../../utils/formatCurrency';
import './ProductCard.css';

const ProductCard = ({ product, variant = 'default', onQuickView }) => {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setIsAdding(true);
    addItem(product, 1);
    setTimeout(() => setIsAdding(false), 300);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  const renderTags = () => {
    if (!product.tags || product.tags.length === 0) return null;
    return (
      <div className="product-tags">
        {product.tags.slice(0, 2).map(tag => (
          <span key={tag} className="product-tag">{tag}</span>
        ))}
      </div>
    );
  };

  const renderRating = () => {
    if (!product.rating) return null;
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;
    return (
      <div className="product-rating">
        <div className="stars" aria-label={`${product.rating} out of 5 stars`}>
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`star ${i < fullStars ? 'filled' : ''} ${i === fullStars && hasHalfStar ? 'half' : ''}`}
              aria-hidden="true"
            >
              ★
            </span>
          ))}
        </div>
        <span className="rating-value">{product.rating.toFixed(1)}</span>
        <span className="rating-count">({product.reviews})</span>
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <article className="product-card compact">
        <div className="product-visual compact" aria-hidden="true">
          <CakeImage variant={product.style} image={product.image} size="small" alt={product.name} />
        </div>
        <div className="product-info compact">
          <h4 className="product-name">{product.name}</h4>
          <p className="product-price">{formatPeso(product.price)}</p>
        </div>
        <button
          className="product-quick-add"
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
          aria-label={`Add ${product.name} to cart`}
        >
          {isAdding ? '✓' : '+'}
        </button>
      </article>
    );
  }

  return (
    <article className={`product-card ${!product.inStock ? 'out-of-stock' : ''}`}>
      <div className="product-visual-wrapper">
        <div className="product-visual" aria-hidden="true">
          <CakeImage variant={product.style} image={product.image} size="medium" alt={product.name} />
        </div>
        {product.originalPrice && (
          <span className="product-badge sale">Save {Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
        )}
        {!product.inStock && (
          <span className="product-badge out-of-stock-badge">Out of Stock</span>
        )}
        {renderTags()}
        <div className="product-overlay">
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleQuickView}
            aria-label={`Quick view ${product.name}`}
          >
            Quick View
          </button>
        </div>
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        {renderRating()}
        <p className="product-description">{product.description}</p>

        <div className="product-details">
          {product.details?.slice(0, 3).map((detail, i) => (
            <span key={i} className="product-detail">{detail}</span>
          ))}
        </div>

        <div className="product-footer">
          <div className="product-price-wrapper">
            <span className="product-price">{formatPeso(product.price)}</span>
            {product.originalPrice && (
              <span className="product-original-price">{formatPeso(product.originalPrice)}</span>
            )}
          </div>
          <button
            className={`btn btn-primary ${!product.inStock ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            aria-label={product.inStock ? `Add ${product.name} to cart` : 'Out of stock'}
          >
            {isAdding ? 'Adding...' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;