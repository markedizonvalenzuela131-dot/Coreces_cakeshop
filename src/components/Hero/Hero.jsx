import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../../context/CartContext';
import { getFeaturedProducts, products } from '../../data/products';
import CakeImage from '../UI/CakeImage';
import { formatPeso } from '../../utils/formatCurrency';
import './Hero.css';

const Hero = ({ onQuickView }) => {
  const { addItem } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts] = useState(getFeaturedProducts(3));

  const slides = [
    {
      id: 1,
      title: 'Fresh Cakes Delivered to Your Door',
      subtitle: 'Custom cakes for every occasion. Order online, pickup in-store.',
      cta: 'Shop Now',
      ctaHref: '#products',
      cakeStyle: 'vanilla'
    },
    {
      id: 2,
      title: 'Wedding Cakes That Wow',
      subtitle: 'Elegant designs crafted for your special day. Book a tasting today.',
      cta: 'View Wedding Cakes',
      ctaHref: '#products?category=wedding',
      cakeStyle: 'wedding'
    },
    {
      id: 3,
      title: 'Seasonal Flavors Are Here',
      subtitle: 'Limited-time pumpkin spice, peppermint, and more. Order before they\'re gone!',
      cta: 'See Seasonal',
      ctaHref: '#products?category=seasonal',
      cakeStyle: 'pumpkin'
    }
  ];

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleQuickAdd = useCallback((product) => {
    addItem(product, 1);
  }, [addItem]);

  const handleScrollTo = useCallback((href) => {
    const [page, query] = href.slice(1).split('?');
    const destination = page === 'products' ? 'cakes' : page;
    window.location.hash = `#${destination}${query ? `?${query}` : ''}`;
  }, []);

  return (
    <section className="hero" id="home" aria-label="Hero section">
      <div className="hero-carousel" role="region" aria-label="Hero slides">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
          >
            <div className="container">
              <div className="hero-content">
                <div className="hero-visual" aria-hidden="true">
                  <CakeImage
                    variant={slide.cakeStyle}
                    image={products.find(product => product.style === slide.cakeStyle)?.image}
                    size="xl"
                    alt={slide.title}
                  />
                </div>
                <div className="hero-text">
                  <h1 className="hero-title">{slide.title}</h1>
                  <p className="hero-subtitle">{slide.subtitle}</p>
                  <div className="hero-actions">
                    <button
                      className="btn btn-primary btn-lg hero-cta"
                      onClick={() => handleScrollTo(slide.ctaHref)}
                    >
                      {slide.cta}
                    </button>
                    <button
                      className="btn btn-outline btn-lg"
                      onClick={() => handleScrollTo('#about')}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hero-indicators" aria-label="Slide indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? 'true' : 'false'}
          ></button>
        ))}
      </div>

      <div className="hero-featured" aria-label="Featured products">
        <div className="container">
          <header className="hero-featured-header">
            <h2 className="hero-featured-title">Featured Favorites</h2>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => handleScrollTo('#products')}
            >
              View All Cakes
            </button>
          </header>
          <div className="hero-featured-grid">
            {featuredProducts.map(product => (
              <article key={product.id} className="hero-product-card">
                <div className="hero-product-visual" aria-hidden="true">
                  <CakeImage variant={product.style} image={product.image} size="large" alt={product.name} />
                </div>
                <div className="hero-product-info">
                  <span className="hero-product-category">{product.category}</span>
                  <h3 className="hero-product-name">{product.name}</h3>
                  <p className="hero-product-description">{product.description}</p>
                  <div className="hero-product-footer">
                    <span className="hero-product-price">{formatPeso(product.price)}</span>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleQuickAdd(product)}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="hero-scroll-indicator" aria-hidden="true">
        <span className="scroll-text">Scroll to explore</span>
        <span className="scroll-arrow" aria-hidden="true">↓</span>
      </div>
    </section>
  );
};

export default Hero;