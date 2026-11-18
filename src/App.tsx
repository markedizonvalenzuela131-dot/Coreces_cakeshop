// ============================================================================
// SweetCrumb Bakery - Main App Component
// ============================================================================

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProviders } from '@/context';
import { Layout, AdminLayout } from '@/components/layout';

// -----------------------------------------------------------------------------
// Lazy-loaded Pages (Code Splitting)
// -----------------------------------------------------------------------------

// Customer Pages
const Home = lazy(() => import('@/pages/customer/Home').then(m => ({ default: m.Home })));
const Catalog = lazy(() => import('@/pages/customer/Catalog').then(m => ({ default: m.Catalog })));
const ProductDetail = lazy(() => import('@/pages/customer/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Cart = lazy(() => import('@/pages/customer/Cart').then(m => ({ default: m.Cart })));
const Checkout = lazy(() => import('@/pages/customer/Checkout').then(m => ({ default: m.Checkout })));
const OrderSuccess = lazy(() => import('@/pages/customer/OrderSuccess').then(m => ({ default: m.OrderSuccess })));
const Orders = lazy(() => import('@/pages/customer/Orders').then(m => ({ default: m.Orders })));
const OrderDetail = lazy(() => import('@/pages/customer/OrderDetail').then(m => ({ default: m.OrderDetail })));
const Profile = lazy(() => import('@/pages/customer/Profile').then(m => ({ default: m.Profile })));
const Login = lazy(() => import('@/pages/auth/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('@/pages/auth/Register').then(m => ({ default: m.Register })));

// Admin Pages
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard').then(m => ({ default: m.Dashboard })));
const AdminProducts = lazy(() => import('@/pages/admin/Products').then(m => ({ default: m.Products })));
const AdminProductForm = lazy(() => import('@/pages/admin/ProductForm').then(m => ({ default: m.ProductForm })));
const AdminOrders = lazy(() => import('@/pages/admin/Orders').then(m => ({ default: m.Orders })));
const AdminOrderDetail = lazy(() => import('@/pages/admin/OrderDetail').then(m => ({ default: m.OrderDetail })));
const AdminCategories = lazy(() => import('@/pages/admin/Categories').then(m => ({ default: m.Categories })));
const AdminPickupSchedule = lazy(() => import('@/pages/admin/PickupSchedule').then(m => ({ default: m.PickupSchedule })));
const AdminAnalytics = lazy(() => import('@/pages/admin/Analytics').then(m => ({ default: m.Analytics })));

// -----------------------------------------------------------------------------
// Loading Fallback
// -----------------------------------------------------------------------------

function PageLoading() {
  return (
    <div className="container-page py-12 flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-body text-text-muted">Loading...</p>
      </div>
    </div>
  );
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageLoading />}>
      {children}
    </Suspense>
  );
}

// -----------------------------------------------------------------------------
// Protected Route Wrapper
// -----------------------------------------------------------------------------

interface ProtectedRouteProps {
  allowedRoles?: ('customer' | 'admin')[];
}

function ProtectedRoute({ allowedRoles = ['customer', 'admin'] }: ProtectedRouteProps) {
  // In a real app, you'd use the auth context here
  // For now, we'll let the pages handle their own auth checks
  void allowedRoles;
  return <Outlet />;
}

// -----------------------------------------------------------------------------
// App Routes
// -----------------------------------------------------------------------------

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes - Customer Layout */}
      <Route element={<Layout />}>
        <Route index element={<SuspenseWrapper><Home /></SuspenseWrapper>} />
        <Route path="catalog" element={<SuspenseWrapper><Catalog /></SuspenseWrapper>} />
        <Route path="product/:id" element={<SuspenseWrapper><ProductDetail /></SuspenseWrapper>} />
        <Route path="cart" element={<SuspenseWrapper><Cart /></SuspenseWrapper>} />
        <Route path="checkout" element={<SuspenseWrapper><Checkout /></SuspenseWrapper>} />
        <Route path="order-success/:orderId" element={<SuspenseWrapper><OrderSuccess /></SuspenseWrapper>} />

        {/* Auth Routes */}
        <Route path="login" element={<SuspenseWrapper><Login /></SuspenseWrapper>} />
        <Route path="register" element={<SuspenseWrapper><Register /></SuspenseWrapper>} />

        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
          <Route path="orders" element={<SuspenseWrapper><Orders /></SuspenseWrapper>} />
          <Route path="orders/:id" element={<SuspenseWrapper><OrderDetail /></SuspenseWrapper>} />
          <Route path="profile" element={<SuspenseWrapper><Profile /></SuspenseWrapper>} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/*" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<SuspenseWrapper><AdminDashboard /></SuspenseWrapper>} />
        <Route path="products" element={<SuspenseWrapper><AdminProducts /></SuspenseWrapper>} />
        <Route path="products/new" element={<SuspenseWrapper><AdminProductForm /></SuspenseWrapper>} />
        <Route path="products/:id/edit" element={<SuspenseWrapper><AdminProductForm /></SuspenseWrapper>} />
        <Route path="orders" element={<SuspenseWrapper><AdminOrders /></SuspenseWrapper>} />
        <Route path="orders/:id" element={<SuspenseWrapper><AdminOrderDetail /></SuspenseWrapper>} />
        <Route path="categories" element={<SuspenseWrapper><AdminCategories /></SuspenseWrapper>} />
        <Route path="pickup" element={<SuspenseWrapper><AdminPickupSchedule /></SuspenseWrapper>} />
        <Route path="analytics" element={<SuspenseWrapper><AdminAnalytics /></SuspenseWrapper>} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// -----------------------------------------------------------------------------
// Main App
// -----------------------------------------------------------------------------

export default function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}