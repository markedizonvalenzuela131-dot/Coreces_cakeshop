import React, { useState, useEffect, useRef } from 'react';
import CakeImage from '../UI/CakeImage';
import { products } from '../../data/products';
import './About.css';

const About = () => {
  const [activeTab, setActiveTab] = useState('story');
  const [stats, setStats] = useState({ cakes: 0, customers: 0, years: 0, reviews: 0 });
  const statsRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateStats();
        }
      });
    }, { threshold: 0.5 });

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const animateStats = () => {
    const targets = { cakes: 12500, customers: 8200, years: 8, reviews: 2400 };
    const duration = 1500;
    const startTime = Date.now();

    const updateNumbers = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setStats({
        cakes: Math.floor(targets.cakes * eased),
        customers: Math.floor(targets.customers * eased),
        years: Math.floor(targets.years * eased),
        reviews: Math.floor(targets.reviews * eased)
      });

      if (progress < 1) requestAnimationFrame(updateNumbers);
    };
    requestAnimationFrame(updateNumbers);
  };

  const tabs = [
    { id: 'story', label: 'Our Story' },
    { id: 'values', label: 'Our Values' },
    { id: 'team', label: 'Meet the Team' }
  ];

  const values = [
    { title: 'Fresh Ingredients', description: 'We source only the finest, freshest ingredients daily. No preservatives, no shortcuts.' },
    { title: 'Artisan Craftsmanship', description: 'Every cake is handcrafted with attention to detail, making each one a unique work of art.' },
    { title: 'Customer Delight', description: 'Your satisfaction is our top priority. We go above and beyond to make every occasion special.' },
    { title: 'Sustainable Practices', description: 'Eco-friendly packaging, local sourcing, and waste reduction in everything we do.' },
    { title: 'Community First', description: 'Proudly supporting local farmers, charities, and community events since day one.' },
    { title: 'Innovation', description: 'Constantly exploring new flavors, techniques, and designs to surprise and delight you.' }
  ];

  const team = [
    { name: 'Sarah Chen', role: 'Founder & Head Baker', bio: '15+ years of pastry experience. Trained in Paris and Tokyo.' },
    { name: 'Marcus Johnson', role: 'Creative Director', bio: 'Award-winning cake artist. Specializes in sculptural wedding cakes.' },
    { name: 'Emma Rodriguez', role: 'Operations Manager', bio: 'Ensures every order is perfect and delivered on time, every time.' },
    { name: 'David Park', role: 'Flavor Innovator', bio: 'Creates our seasonal and specialty flavors. Loves experimenting.' }
  ];

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'k';
    return num.toString();
  };

  return (
    <section className="about" id="about" aria-labelledby="about-heading">
      <div className="container">
        <header className="section-header">
          <h2 id="about-heading" className="section-title">About Coreces</h2>
          <p className="section-subtitle">
            More than a bakery — we're memory makers, celebrating life's sweetest moments since 2016
          </p>
        </header>

        <div className="about-tabs" role="tablist" aria-label="About sections">
          {tabs.map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              id={`${tab.id}-tab`}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="about-panels">
          {/* Our Story */}
          <div
            role="tabpanel"
            id="story-panel"
            aria-labelledby="story-tab"
            className={`tab-panel ${activeTab === 'story' ? 'active' : ''}`}
            hidden={activeTab !== 'story'}
          >
            <div className="story-content">
              <div className="story-text">
                <h3>Our Journey</h3>
                <p>
                  Coreces began in a small home kitchen in 2016, when founder Sarah Chen decided to share her grandmother's
                  secret cake recipes with the world. What started as weekend orders for friends and family quickly grew
                  into a beloved neighborhood bakery.
                </p>
                <p>
                  Today, we operate from our flagship location, serving thousands of happy customers each year. But our
                  mission remains the same: to create cakes that bring people together and make every celebration unforgettable.
                </p>
                <div className="story-highlights">
                  <div className="highlight">
                    <div className="highlight-badge" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6l-6 6-6-6"/><path d="M12 2v16"/></svg>
                    </div>
                    <div>
                      <strong>Best Bakery 2023</strong> - City Magazine
                    </div>
                  </div>
                  <div className="highlight">
                    <div className="highlight-badge" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    </div>
                    <div>
                      <strong>2 Locations</strong> - Downtown & Uptown
                    </div>
                  </div>
                  <div className="highlight">
                    <div className="highlight-badge" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div>
                      <strong>12 Artisan Bakers</strong> - Trained professionals
                    </div>
                  </div>
                </div>
              </div>
              <div className="story-visual" aria-hidden="true">
                <div className="story-cake-wrapper">
                  <CakeImage
                    variant="wedding"
                    image={products.find(product => product.style === 'wedding')?.image}
                    size="xl"
                    alt="Our signature wedding cake"
                  />
                </div>
                <div className="story-badges">
                  <span className="badge badge-primary">Est. 2016</span>
                  <span className="badge badge-success">Family Owned</span>
                  <span className="badge badge-info">Award Winning</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="about-stats" aria-label="Company statistics" ref={statsRef}>
              <div className="stat">
                <span className="stat-number">{formatNumber(stats.cakes)}+</span>
                <span className="stat-label">Cakes Baked</span>
              </div>
              <div className="stat">
                <span className="stat-number">{formatNumber(stats.customers)}+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat">
                <span className="stat-number">{stats.years}+</span>
                <span className="stat-label">Years of Excellence</span>
              </div>
              <div className="stat">
                <span className="stat-number">{formatNumber(stats.reviews)}+</span>
                <span className="stat-label">5-Star Reviews</span>
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div
            role="tabpanel"
            id="values-panel"
            aria-labelledby="values-tab"
            className={`tab-panel ${activeTab === 'values' ? 'active' : ''}`}
            hidden={activeTab !== 'values'}
          >
            <div className="values-grid">
              {values.map((value, index) => (
                <article key={value.title} className="value-card" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="value-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
                  <h4 className="value-title">{value.title}</h4>
                  <p className="value-description">{value.description}</p>
                </article>
              ))}
            </div>
          </div>

          {/* Meet the Team */}
          <div
            role="tabpanel"
            id="team-panel"
            aria-labelledby="team-tab"
            className={`tab-panel ${activeTab === 'team' ? 'active' : ''}`}
            hidden={activeTab !== 'team'}
          >
            <div className="team-grid">
              {team.map((member, index) => (
                <article key={member.name} className="team-card" style={{ animationDelay: `${index * 150}ms` }}>
                  <div className="team-visual" aria-hidden="true">
                    <CakeImage variant={index === 0 ? 'wedding' : index === 1 ? 'chocolate' : index === 2 ? 'vanilla' : 'matcha'} size="medium" alt={member.name} />
                  </div>
                  <div className="team-info">
                    <h4 className="team-name">{member.name}</h4>
                    <p className="team-role">{member.role}</p>
                    <p className="team-bio">{member.bio}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;