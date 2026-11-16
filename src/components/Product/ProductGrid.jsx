import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { getProductsByCategory, searchProducts, categories } from '../../data/products';
import './ProductGrid.css';

const ProductGrid = ({ initialCategory = 'all', initialSearch = '', onQuickView }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Load products
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const loadedProducts = getProductsByCategory(selectedCategory);
      setProducts(loadedProducts);
      setFilteredProducts(loadedProducts);
      setLoading(false);
    }, 300);
  }, [selectedCategory]);

  // Filter products
  useEffect(() => {
    let result = [...products];

    if (searchQuery) {
      result = searchProducts(searchQuery);
      if (selectedCategory !== 'all') {
        result = result.filter(p => p.category === selectedCategory);
      }
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        // Featured: in stock first, then by rating
        result.sort((a, b) => {
          if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
          return b.rating - a.rating;
        });
    }

    setFilteredProducts(result);
  }, [products, searchQuery, sortBy, selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters = selectedCategory !== 'all' || searchQuery;

  if (loading) {
    return (
      <div className="product-grid-loading">
        <div className="loading-skeleton">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-image"></div>
              <div className="skeleton-content">
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
                <div className="skeleton-line"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="product-grid-section" id="products" aria-label="Products">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Our Cakes</h2>
          <p className="section-subtitle">Discover handcrafted cakes made with love and the finest ingredients</p>
        </div>

        <div className="product-toolbar">
          <div className="search-wrapper">
            <form onSubmit={handleSearchSubmit} className="search-form" role="search">
              <label htmlFor="product-search" className="visually-hidden">Search cakes</label>
              <input
                id="product-search"
                type="search"
                placeholder="Search cakes..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
                aria-label="Search cakes"
              />
              <button type="submit" className="search-btn" aria-label="Search">
                🔍
              </button>
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </form>
          </div>

          <div className="toolbar-actions">
            <div className="sort-wrapper">
              <label htmlFor="sort-select" className="visually-hidden">Sort by</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            <div className="view-toggle" role="group" aria-label="View mode">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
              >
                ⊞
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
              >
                ☰
              </button>
            </div>

            <button
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-controls="category-filters"
            >
              🏷️ Categories
              {hasActiveFilters && <span className="filter-badge">!</span>}
            </button>

            {hasActiveFilters && (
              <button
                className="btn btn-secondary btn-sm clear-filters"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="category-filters" id="category-filters" role="group" aria-label="Category filters" hidden={!showFilters}>
          <div className="category-chips">
            <button
              className={`category-chip ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('all')}
              aria-pressed={selectedCategory === 'all'}
            >
              All Cakes
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.id)}
                aria-pressed={selectedCategory === cat.id}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="results-info">
          <p>
            Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> cakes
            {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No cakes found</h3>
            <p>Try adjusting your search or filters</p>
            <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <div
            className={`products-grid ${viewMode === 'list' ? 'list-view' : ''}`}
            role="list"
            aria-label="Products"
          >
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                variant={viewMode === 'list' ? 'compact' : 'default'}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}

        {filteredProducts.length > 6 && (
          <div className="load-more-wrapper">
            <button className="btn btn-outline load-more-btn">Load More Cakes</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;