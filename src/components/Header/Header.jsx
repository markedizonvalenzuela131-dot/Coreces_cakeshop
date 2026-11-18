import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import './Header.css';

const Header = () => {
  const { toggleTheme, isDark } = useTheme();
  const { getTotalItems, toggleCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'cakes', label: 'Cakes', href: '#cakes' },
    { id: 'categories', label: 'Categories', href: '#categories' },
    { id: 'contact', label: 'Contact', href: '#contact' },
    { id: 'cart', label: 'Cart', href: '#cart' }
  ];

  useEffect(() => {
    const updateActiveNav = () => {
      const currentPage = window.location.hash.slice(1).split('?')[0] || 'home';
      setActiveNav(currentPage);
    };
    updateActiveNav();
    window.addEventListener('hashchange', updateActiveNav);
    return () => window.removeEventListener('hashchange', updateActiveNav);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <a href="#home" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
          <span className="logo-icon">🎂</span>
          <span className="logo-text">Coreces</span>
        </a>

        <nav className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`} role="navigation" aria-label="Main navigation">
          <ul className="nav-list">
            {navItems.map(item => (
              <li key={item.id} className="nav-item">
                <a
                  className={`nav-link ${activeNav === item.id ? 'active' : ''}`}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          <button
            className="cart-toggle"
            onClick={toggleCart}
            aria-label="Shopping cart"
          >
            <span className="cart-icon">🛒</span>
            <span className="cart-count">{getTotalItems()}</span>
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;