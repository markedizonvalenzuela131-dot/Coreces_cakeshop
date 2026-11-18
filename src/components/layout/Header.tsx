// ============================================================================
// SweetCrumb Bakery - Layout Components
// ============================================================================

import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, NavLink, Outlet } from 'react-router-dom';
import { clsx } from 'clsx';
import { Menu, X, Search, ShoppingCart, User, LogOut, Sun, Moon, ChevronDown } from 'lucide-react';
import { Button, Avatar, DropdownMenu, type DropdownItem } from '@/components/ui';
import { useAuth } from '@/context';
import { useCart } from '@/context';
import { useUI } from '@/context';

// -----------------------------------------------------------------------------
// Header / Navbar
// -----------------------------------------------------------------------------

export function Header() {
  const { user, role, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { theme, toggleTheme, mobileMenuOpen, setMobileMenuOpen, setSearchOpen } = useUI();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, setMobileMenuOpen]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current?.contains(event.target as Node)) return;
      setUserMenuOpen(false);
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/catalog', label: 'Catalog' },
    { href: '/orders', label: 'My Orders', auth: true },
    { href: '/profile', label: 'Profile', auth: true },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/products', label: 'Products' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/categories', label: 'Categories' },
    { href: '/admin/pickup', label: 'Pickup Schedule' },
    { href: '/admin/analytics', label: 'Analytics' },
  ];

  const userMenuItems: DropdownItem[] = isAuthenticated ? [
    { label: 'My Account', value: 'account', icon: <User className="w-4 h-4" /> },
    { label: 'My Orders', value: 'orders', icon: <ShoppingCart className="w-4 h-4" /> },
    { label: 'Settings', value: 'settings', icon: <ChevronDown className="w-4 h-4" /> },
    { divider: true },
    { label: role === 'admin' ? 'Admin Dashboard' : 'Logout', value: role === 'admin' ? 'admin' : 'logout', icon: role === 'admin' ? <ChevronDown className="w-4 h-4" /> : <LogOut className="w-4 h-4" />, dangerous: role !== 'admin' },
  ] : [
    { label: 'Login', value: 'login', icon: <User className="w-4 h-4" /> },
    { label: 'Register', value: 'register', icon: <User className="w-4 h-4" /> },
  ];

  const handleUserMenuSelect = (value: string) => {
    setUserMenuOpen(false);
    switch (value) {
      case 'account': window.location.href = '/profile'; break;
      case 'orders': window.location.href = '/orders'; break;
      case 'settings': window.location.href = '/settings'; break;
      case 'admin': window.location.href = '/admin'; break;
      case 'logout': logout(); break;
      case 'login': window.location.href = '/login'; break;
      case 'register': window.location.href = '/register'; break;
    }
  };

  return (
    <header className={clsx('sticky top-0 z-sticky transition-all duration-normal', scrolled ? 'shadow-card bg-white/95 backdrop-blur-sm' : 'bg-white')}>
      <nav className="container-page" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="SweetCrumb Bakery Home">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-warm-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8ZM12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14ZM4 20V18C4 16.34 5.34 15 7 15H17C18.66 15 20 16.34 20 18V20H4Z" />
              </svg>
            </div>
            <span className="font-display font-semibold text-heading-lg text-charcoal-900 hidden sm:block">SweetCrumb</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) => clsx(
                  'px-3 py-2 rounded-lg text-body-sm font-medium transition-colors',
                  isActive ? 'bg-primary-light text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-warm-50'
                )}
                end={link.href === '/'}
              >
                {link.label}
              </NavLink>
            ))}
            {role === 'admin' && (
              <div className="relative">
                <button className="btn btn-ghost btn-sm gap-1">
                  Admin
                  <ChevronDown className="w-4 h-4" />
                </button>
                <DropdownMenu
                  items={adminLinks.map(l => ({ label: l.label, value: l.href }))}
                  onSelect={(value) => window.location.href = value}
                  align="right"
                  trigger={<span />}
                />
              </div>
            )}
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 px-4"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-text-muted" />
              <span className="text-text-muted">Search cakes...</span>
            </Button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" aria-label={`Shopping cart${itemCount > 0 ? ` with ${itemCount} items` : ''}`}>
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 badge badge-error badge-sm">{itemCount > 99 ? '99+' : itemCount}</span>
                )}
              </Button>
            </Link>

            {/* User Menu / Auth */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-warm-100 transition-colors"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <Avatar src={user?.avatar} name={user?.name || 'User'} size="sm" />
                  <span className="hidden sm:block text-body-sm font-medium text-text-primary">{user?.name}</span>
                  <ChevronDown className={clsx('w-4 h-4 text-text-muted transition-transform', userMenuOpen && 'rotate-180')} />
                </button>
                {userMenuOpen && (
                  <DropdownMenu
                    items={userMenuItems}
                    onSelect={handleUserMenuSelect}
                    align="right"
                    trigger={<span />}
                  />
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => window.location.href = '/login'}>
                  Login
                </Button>
                <Button size="sm" onClick={() => window.location.href = '/register'}>
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden py-4 border-t border-border animate-slide-down">
            <div className="flex flex-col gap-2">
              {navLinks.map(link => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => clsx(
                    'px-3 py-2 rounded-lg text-body font-medium',
                    isActive ? 'bg-primary-light text-primary' : 'text-text-secondary hover:bg-warm-50'
                  )}
                  end={link.href === '/'}
                >
                  {link.label}
                </NavLink>
              ))}
              {role === 'admin' && (
                <div className="pt-2 border-t border-border">
                  <p className="px-3 py-2 text-caption font-medium text-text-muted uppercase">Admin</p>
                  {adminLinks.map(link => (
                    <NavLink
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-6 py-2 text-body text-text-secondary hover:bg-warm-50"
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              )}
              <div className="pt-4 border-t border-border flex items-center gap-2">
                <Button variant="outline" className="flex-1" onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}>
                  <Search className="w-5 h-5 mr-2" /> Search
                </Button>
              </div>
              {isAuthenticated ? (
                <div className="pt-2 border-t border-border">
                  <Button variant="outline" className="w-full justify-start" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                    <LogOut className="w-5 h-5 mr-2" /> Logout
                  </Button>
                </div>
              ) : (
                <div className="pt-2 border-t border-border flex flex-col gap-2">
                  <Button variant="outline" className="w-full" onClick={() => { window.location.href = '/login'; setMobileMenuOpen(false); }}>
                    Login
                  </Button>
                  <Button className="w-full" onClick={() => { window.location.href = '/register'; setMobileMenuOpen(false); }}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

// -----------------------------------------------------------------------------
// Footer
// -----------------------------------------------------------------------------

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks: Record<string, Array<{ label: string; href: string; external?: boolean }>> = {
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Story', href: '/story' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
    ],
    Support: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faq' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
    Connect: [
      { label: 'Facebook', href: 'https://facebook.com', external: true },
      { label: 'Instagram', href: 'https://instagram.com', external: true },
      { label: 'Twitter', href: 'https://twitter.com', external: true },
      { label: 'Newsletter', href: '/newsletter' },
    ],
  };

  return (
    <footer className="bg-charcoal-900 text-charcoal-100" role="contentinfo">
      <div className="container-page py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4" aria-label="SweetCrumb Bakery Home">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-warm-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8ZM12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14ZM4 20V18C4 16.34 5.34 15 7 15H17C18.66 15 20 16.34 20 18V20H4Z" />
                </svg>
              </div>
              <span className="font-display font-semibold text-heading-lg">SweetCrumb</span>
            </Link>
            <p className="text-body-sm text-charcoal-400 mb-4 max-w-xs">
              Fresh artisan cakes made with love. Order online for pickup at our bakery.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" className="text-charcoal-400 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="https://instagram.com" className="text-charcoal-400 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.79 4-4 4z" /></svg>
              </a>
              <a href="https://twitter.com" className="text-charcoal-400 hover:text-white transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-medium text-white mb-4">{category}</h4>
              <ul className="space-y-2" role="list">
                {links.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-body-sm text-charcoal-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-charcoal-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-body-sm text-charcoal-500">
            © {currentYear} SweetCrumb Bakery. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-body-sm text-charcoal-500">
            <span>Made with 🍰 in the Philippines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// -----------------------------------------------------------------------------
// Layout Wrapper
// -----------------------------------------------------------------------------

interface LayoutProps {
  className?: string;
}

export function Layout({ className }: LayoutProps) {
  return (
    <div className={clsx('min-h-screen flex flex-col', className)}>
      <Header />
      <main className="flex-1" id="main-content" role="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Admin Layout
// -----------------------------------------------------------------------------

interface AdminLayoutProps {
  className?: string;
}

export function AdminLayout({ className }: AdminLayoutProps) {
  const { sidebarOpen, setSidebarOpen } = useUI();
  const location = useLocation();
  const { user, role, logout } = useAuth();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { href: '/admin/products', label: 'Products', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
    { href: '/admin/orders', label: 'Orders', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2v-4a2 2 0 00-2-2zm-12 4a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4z" /></svg> },
    { href: '/admin/categories', label: 'Categories', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg> },
    { href: '/admin/pickup', label: 'Pickup Schedule', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { href: '/admin/analytics', label: 'Analytics', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
  ];

  return (
    <div className={clsx('min-h-screen bg-warm-50 flex', className)}>
      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-white border-r border-border transition-transform duration-normal',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="Admin sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-warm-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8ZM12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14ZM4 20V18C4 16.34 5.34 15 7 15H17C18.66 15 20 16.34 20 18V20H4Z" />
              </svg>
            </div>
            <div>
              <h1 className="font-display font-semibold text-heading-md text-charcoal-900">SweetCrumb</h1>
              <p className="text-caption text-text-muted">Admin Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Admin navigation">
            {navItems.map(item => (
              <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive: active }) => clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm font-medium transition-colors',
                    active
                      ? 'bg-primary-light text-primary'
                      : 'text-text-secondary hover:bg-warm-50 hover:text-text-primary'
                  )}
                  end={item.href === '/admin'}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {item.label}
                </NavLink>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <Avatar src={user?.avatar} name={user?.name || 'Admin'} size="md" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary truncate">{user?.name}</p>
                <p className="text-caption text-text-muted capitalize">{role}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {!sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-border">
          <div className="container-page h-16 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </Button>
            <h1 className="text-heading-lg font-medium text-charcoal-900 lg:ml-4">
              {navItems.find(i => location.pathname === i.href || (i.href !== '/admin' && location.pathname.startsWith(i.href)))?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8" id="main-content" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}