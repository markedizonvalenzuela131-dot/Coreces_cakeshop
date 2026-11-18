// ============================================================================
// SweetCrumb Bakery - Home Page
// ============================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Heart, Sparkles, Cake } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { Card, ProductCard } from '@/components/ui';
import { Section, containerPage } from '@/styles';

// -----------------------------------------------------------------------------
// Mock Data (Replace with API calls)
// -----------------------------------------------------------------------------

const featuredProducts = [
  {
    productId: '1',
    productName: 'Classic Chocolate Fudge',
    description: 'Rich dark chocolate cake with velvety fudge frosting',
    price: 45000, // in cents
    imageReference: '/cakes/chocolate-fudge.jpg',
    availabilityStatus: 'Available' as const,
    categoryName: 'Celebration Cakes',
  },
  {
    productId: '2',
    productName: 'Strawberry Shortcake',
    description: 'Light vanilla sponge with fresh strawberries and cream',
    price: 38000,
    imageReference: '/cakes/strawberry-shortcake.jpg',
    availabilityStatus: 'Available' as const,
    categoryName: 'Celebration Cakes',
  },
  {
    productId: '3',
    productName: 'Red Velvet Dream',
    description: 'Classic red velvet with cream cheese frosting',
    price: 42000,
    imageReference: '/cakes/red-velvet.jpg',
    availabilityStatus: 'Available' as const,
    categoryName: 'Celebration Cakes',
  },
  {
    productId: '4',
    productName: 'Ube Cheesecake',
    description: 'Filipino favorite ube halaya with creamy cheesecake',
    price: 48000,
    imageReference: '/cakes/ube-cheesecake.jpg',
    availabilityStatus: 'Available' as const,
    categoryName: 'Seasonal Specials',
  },
];

const categories = [
  {
    id: '1',
    name: 'Celebration Cakes',
    description: 'Birthdays, anniversaries & special occasions',
    image: '/categories/celebration.jpg',
    count: 24,
  },
  {
    id: '2',
    name: 'Wedding Cakes',
    description: 'Elegant multi-tiered masterpieces',
    image: '/categories/wedding.jpg',
    count: 12,
  },
  {
    id: '3',
    name: 'Cupcakes',
    description: 'Perfect individual treats',
    image: '/categories/cupcakes.jpg',
    count: 36,
  },
  {
    id: '4',
    name: 'Pastries',
    description: 'Fresh baked daily',
    image: '/categories/pastries.jpg',
    count: 18,
  },
];

const features = [
  {
    icon: Truck,
    title: 'Fresh Daily',
    description: 'Baked fresh every morning with premium ingredients',
  },
  {
    icon: Shield,
    title: 'Quality Guaranteed',
    description: '100% satisfaction or we\'ll make it right',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Handcrafted by our passionate bakers',
  },
  {
    icon: Sparkles,
    title: 'Custom Designs',
    description: 'Personalized cakes for your special moments',
  },
];

// -----------------------------------------------------------------------------
// Hero Section
// -----------------------------------------------------------------------------

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-warm-50 to-white py-20 lg:py-32">
      <div className="container-page">
        <div className="max-w-3xl mx-auto text-center">
          {/* Decorative element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10 lg:w-[800px] lg:h-[800px]" />

          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light text-primary text-body-sm font-medium mb-6">
            <Cake className="w-4 h-4" />
            Fresh Artisan Cakes • Order Online for Pickup
          </span>

          <h1 className="text-display-xl lg:text-display-lg font-display font-medium text-charcoal-900 mb-6 text-balance">
            Sweet Moments Start with{' '}
            <span className="text-primary">SweetCrumb</span>
          </h1>

          <p className="text-body-lg text-text-secondary mb-8 max-w-2xl mx-auto text-pretty">
            Discover handcrafted cakes made with love and the finest ingredients.
            Order online and pick up at our bakery — fresh, beautiful, and unforgettable.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/catalog">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Browse Our Cakes
              </Button>
            </Link>
            <Link to="/catalog?category=custom">
              <Button variant="outline" size="lg">
                Order Custom Cake
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Features Section
// -----------------------------------------------------------------------------

function Features() {
  return (
    <section className="section bg-white">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card key={index} variant="hover" padding="lg" className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary-light flex items-center justify-center">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-heading-sm font-medium text-charcoal-900 mb-2">{feature.title}</h3>
              <p className="text-body-sm text-text-muted">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Categories Section
// -----------------------------------------------------------------------------

function Categories() {
  return (
    <section className="section bg-warm-50">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-display-md font-display font-medium text-charcoal-900 mb-4">Shop by Category</h2>
          <p className="text-body text-text-secondary">Find the perfect cake for every occasion</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} to={`/catalog?category=${category.id}`} className="group">
              <Card variant="hover" className="overflow-hidden h-full">
                <div className="relative aspect-[4/3] overflow-hidden bg-charcoal-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-warm-500/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Cake className="w-16 h-16 text-primary/30 group-hover:text-primary/50 transition-colors" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-heading-sm font-medium text-charcoal-900 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-body-sm text-text-muted mt-1">{category.description}</p>
                  <p className="text-caption text-text-muted mt-3">{category.count} products</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/catalog">
            <Button variant="outline" rightIcon={<ArrowRight className="w-5 h-5" />}>
              View All Categories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Featured Products Section
// -----------------------------------------------------------------------------

function FeaturedProducts() {
  return (
    <section className="section bg-white">
      <div className="container-page">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-display-md font-display font-medium text-charcoal-900">Featured Cakes</h2>
            <p className="text-body text-text-muted mt-1">Our most loved creations</p>
          </div>
          <Link to="/catalog">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              variant="featured"
              onAddToCart={(p) => console.log('Add to cart:', p)}
              onQuickView={(p) => console.log('Quick view:', p)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// CTA Section
// -----------------------------------------------------------------------------

function CTA() {
  return (
    <section className="section bg-charcoal-900">
      <div className="container-page">
        <Card className="bg-gradient-to-br from-charcoal-900 to-charcoal-800 border-border-strong/50 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-5" />
          <div className="relative max-w-3xl">
            <h2 className="text-display-md font-display font-medium mb-4">Ready for Something Special?</h2>
            <p className="text-body-lg text-charcoal-300 mb-8">
              Let us create a custom cake that tells your story. From elegant weddings to fun birthdays,
              our bakers bring your vision to life.
            </p>
            <Link to="/catalog?category=custom">
              <Button variant="secondary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Design Your Cake
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Testimonials Section
// -----------------------------------------------------------------------------

function Testimonials() {
  const testimonials = [
    {
      quote: 'The chocolate fudge cake was absolutely divine! Moist, rich, and the perfect sweetness. My daughter\'s birthday was made perfect.',
      author: 'Maria Santos',
      occasion: 'Birthday Party',
      rating: 5,
    },
    {
      quote: 'We ordered a custom wedding cake and it exceeded all expectations. Beautiful design, incredible taste, and delivered on time.',
      author: 'James & Patricia',
      occasion: 'Wedding',
      rating: 5,
    },
    {
      quote: 'Best ube cheesecake I\'ve ever had! The ube flavor is authentic and the texture is perfectly creamy. Will definitely order again.',
      author: 'Kevin Reyes',
      occasion: 'Anniversary',
      rating: 5,
    },
  ];

  return (
    <section className="section bg-white">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-display-md font-display font-medium text-charcoal-900 mb-4">Loved by Our Customers</h2>
          <p className="text-body text-text-secondary">See what people are saying about SweetCrumb</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} variant="hover" padding="lg" className="h-full">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }, (_, i) => (
                  <svg key={i} className="w-5 h-5 text-warm-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-body text-text-secondary mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
              <div>
                <p className="font-medium text-charcoal-900">{testimonial.author}</p>
                <p className="text-body-sm text-text-muted">{testimonial.occasion}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Newsletter Section
// -----------------------------------------------------------------------------

function Newsletter() {
  return (
    <section className="section bg-warm-50">
      <div className="container-page">
        <Card className="bg-white border-border p-8 md:p-12 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary-light flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-display-sm font-display font-medium text-charcoal-900 mb-3">Stay Updated</h2>
          <p className="text-body text-text-muted mb-6">Get the latest cake designs, seasonal specials, and exclusive offers delivered to your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1"
              aria-label="Email address"
            />
            <Button type="submit">Subscribe</Button>
          </form>
          <p className="text-caption text-text-muted mt-4">No spam, unsubscribe anytime.</p>
        </Card>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Home Page Export
// -----------------------------------------------------------------------------

export function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Categories />
      <FeaturedProducts />
      <Testimonials />
      <CTA />
      <Newsletter />
    </>
  );
}