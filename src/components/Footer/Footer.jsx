import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '#about' },
      { label: 'Our Story', href: '#about' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' }
    ],
    support: [
      { label: 'Contact Us', href: '#contact' },
      { label: 'FAQs', href: '#faqs' },
      { label: 'Delivery Info', href: '#delivery' },
      { label: 'Returns Policy', href: '#returns' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
      { label: 'Cookie Policy', href: '#cookies' }
    ],
    social: [
      { label: 'Facebook', href: '#', icon: '📘' },
      { label: 'Instagram', href: '#', icon: '📷' },
      { label: 'Twitter', href: '#', icon: '🐦' },
      { label: 'Pinterest', href: '#', icon: '📌' }
    ]
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#home" className="footer-logo">
              <span className="logo-icon">🎂</span>
              <span className="logo-text">Coreces</span>
            </a>
            <p className="footer-tagline">
              Crafting delicious memories, one cake at a time.
              Fresh ingredients, custom designs, and love in every slice.
            </p>
            <div className="social-links">
              {footerLinks.social.map(item => (
                <a key={item.label} href={item.href} className="social-link" aria-label={item.label}>
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          <nav className="footer-nav" aria-label="Company links">
            <h4 className="footer-title">Company</h4>
            <ul>
              {footerLinks.company.map(item => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-nav" aria-label="Support links">
            <h4 className="footer-title">Support</h4>
            <ul>
              {footerLinks.support.map(item => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-nav" aria-label="Legal links">
            <h4 className="footer-title">Legal</h4>
            <ul>
              {footerLinks.legal.map(item => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-newsletter">
            <h4 className="footer-title">Stay Updated</h4>
            <p className="newsletter-text">Subscribe for special offers and new flavor alerts!</p>
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Thanks for subscribing! 🎂'); }}>
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
                required
                aria-label="Email address"
              />
              <button type="submit" className="btn btn-primary newsletter-btn">Subscribe</button>
            </form>
            <div className="payment-methods">
              <span className="payment-label">We accept:</span>
              <div className="payment-icons">
                <span>💳</span>
                <span>💳</span>
                <span>📱</span>
                <span>💰</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; {currentYear} Coreces. All rights reserved. Made with ❤️ for cake lovers.
            </p>
            <div className="footer-badges">
              <span className="badge badge-primary">Fresh Daily</span>
              <span className="badge badge-success">Custom Orders</span>
              <span className="badge badge-info">Pickup & Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;