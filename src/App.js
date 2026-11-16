import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Hero from './components/Hero/Hero';
import ProductGrid from './components/Product/ProductGrid';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import OrderStatus from './components/OrderStatus/OrderStatus';
import CartSidebar from './components/Cart/CartSidebar';
import QuickViewModal from './components/QuickView/QuickViewModal';
import Notification from './components/Notification/Notification';
import CakePhoto from './components/UI/CakePhoto';
import { categories, products } from './data/products';
import './App.css';

const getRoute = () => {
  const [page, query = ''] = window.location.hash.slice(1).split('?');
  const validPages = ['home', 'about', 'cakes', 'categories', 'contact'];
  const params = new URLSearchParams(query);

  return {
    page: validPages.includes(page) ? page : 'home',
    category: params.get('category') || 'all'
  };
};

function CategoryPage() {
  return (
    <section className="category-page page-section" aria-labelledby="category-title">
      <div className="container">
        <header className="section-header">
          <h1 id="category-title" className="section-title">Cake Categories</h1>
          <p className="section-subtitle">Choose a collection to find the cake for your occasion.</p>
        </header>
        <div className="category-page-grid">
          {categories.map(category => {
            const product = products.find(item => item.category === category.id);
            return (
              <a
                className="category-page-card"
                href={`#cakes?category=${category.id}`}
                key={category.id}
              >
                {product?.image && <CakePhoto src={product.image} alt="" />}
                <span className="category-page-copy">
                  <strong>{category.name}</strong>
                  <span>{category.description}</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AppContent() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [route, setRoute] = useState(getRoute);

  const handleCloseQuickView = () => {
    setShowQuickView(false);
    setQuickViewProduct(null);
  };

  React.useEffect(() => {
    const handleRouteChange = () => {
      setRoute(getRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleRouteChange);
    return () => window.removeEventListener('hashchange', handleRouteChange);
  }, []);

  return (
    <div className="app">
      <Header />
      <main id="main-content" className="main-content">
        {route.page === 'home' && (
          <>
            <Hero />
            <OrderStatus />
          </>
        )}
        {route.page === 'about' && <About />}
        {route.page === 'cakes' && (
          <ProductGrid
            key={`${route.page}-${route.category}`}
            initialCategory={route.category}
            onQuickView={(product) => { setQuickViewProduct(product.id); setShowQuickView(true); }}
          />
        )}
        {route.page === 'categories' && <CategoryPage />}
        {route.page === 'contact' && <Contact />}
      </main>
      <Footer />
      <CartSidebar />
      <QuickViewModal
        productId={quickViewProduct}
        isOpen={showQuickView}
        onClose={handleCloseQuickView}
      />
      <Notification />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <OrderProvider>
          <AppContent />
        </OrderProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;