// ============================================================================
// SweetCrumb Bakery - Admin Dashboard (Refactored)
// ============================================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ShoppingCart, DollarSign, TrendingUp, Package, AlertTriangle } from 'lucide-react';
import { Card, StatCard, Badge, Button, Table, createOrderColumns, Alert } from '@/components/ui';
import { formatCurrency, cn } from '@/lib/utils';
import { clsx } from 'clsx';
import { useAdminOrders } from '@/hooks';
import { useProducts } from '@/hooks';

// -----------------------------------------------------------------------------
// Dashboard Page
// -----------------------------------------------------------------------------

export function Dashboard() {
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year'>('week');

  const { filteredOrders, totalCount: totalOrders } = useAdminOrders();
  const { products } = useProducts();

  const handleDateRangeChange = (range: typeof dateRange) => {
    setDateRange(range);
  };

  // Calculate stats from real data
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const activeCustomers = new Set(filteredOrders.map(o => o.customerName)).size;

  // Recent orders (last 5)
  const recentOrders = filteredOrders.slice(0, 5);

  // Top products by order count
  const productOrderCounts: Record<string, { orders: number; revenue: number }> = {};
  filteredOrders.forEach(order => {
    order.items.forEach(item => {
      if (!productOrderCounts[item.productName]) {
        productOrderCounts[item.productName] = { orders: 0, revenue: 0 };
      }
      productOrderCounts[item.productName].orders += item.quantity;
      productOrderCounts[item.productName].revenue += item.lineTotal;
    });
  });
  const topProducts = Object.entries(productOrderCounts)
    .map(([productName, data]) => ({ productName, ...data }))
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 5);

  // Low stock products
  const lowStockProducts = products
    .filter(p => p.availabilityStatus === 'Out of Stock' || p.availabilityStatus === 'Limited')
    .slice(0, 3)
    .map(p => ({
      productName: p.productName,
      category: p.categoryName,
      stock: p.availabilityStatus === 'Out of Stock' ? 0 : 3,
      status: p.availabilityStatus === 'Out of Stock' ? 'Out of Stock' : 'Low Stock',
    }));

  // Pending pickups today
  const today = new Date().toISOString().split('T')[0];
  const pendingPickups = filteredOrders
    .filter(o => o.pickupDate === today && ['Confirmed', 'Preparing'].includes(o.statusName))
    .slice(0, 3)
    .map(o => ({
      customerName: o.customerName,
      orderId: o.orderId,
      pickupTime: o.pickupTime,
      items: o.itemCount,
    }));

  const stats = [
    {
      title: 'Total Revenue',
      value: totalRevenue,
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: <DollarSign className="w-6 h-6" />,
      trend: [
        { x: 'Mon', y: 1200000 },
        { x: 'Tue', y: 1350000 },
        { x: 'Wed', y: 1100000 },
        { x: 'Thu', y: 1450000 },
        { x: 'Fri', y: 1600000 },
        { x: 'Sat', y: 2100000 },
        { x: 'Sun', y: 1800000 },
      ],
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: <ShoppingCart className="w-6 h-6" />,
      trend: [
        { x: 'Mon', y: 35 },
        { x: 'Tue', y: 42 },
        { x: 'Wed', y: 38 },
        { x: 'Thu', y: 48 },
        { x: 'Fri', y: 55 },
        { x: 'Sat', y: 72 },
        { x: 'Sun', y: 52 },
      ],
    },
    {
      title: 'Avg Order Value',
      value: Math.round(avgOrderValue),
      change: '-2.1%',
      changeType: 'decrease' as const,
      icon: <TrendingUp className="w-6 h-6" />,
      trend: [
        { x: 'Mon', y: 34000 },
        { x: 'Tue', y: 35000 },
        { x: 'Wed', y: 36000 },
        { x: 'Thu', y: 37000 },
        { x: 'Fri', y: 36500 },
        { x: 'Sat', y: 38000 },
        { x: 'Sun', y: 37500 },
      ],
    },
    {
      title: 'Active Customers',
      value: activeCustomers,
      change: '+15.3%',
      changeType: 'increase' as const,
      icon: <Users className="w-6 h-6" />,
      trend: [
        { x: 'Mon', y: 110 },
        { x: 'Tue', y: 115 },
        { x: 'Wed', y: 118 },
        { x: 'Thu', y: 122 },
        { x: 'Fri', y: 125 },
        { x: 'Sat', y: 128 },
        { x: 'Sun', y: 128 },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-display-md font-display font-medium text-charcoal-900">Dashboard</h1>
          <p className="text-body text-text-muted mt-1">Overview of your bakery's performance</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={e => handleDateRangeChange(e.target.value as typeof dateRange)}
            className="input w-auto px-3 py-2 text-body-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="outline" leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {lowStockProducts.some(p => p.status === 'Out of Stock') && (
        <Alert variant="warning" className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5" />
              <div>
                <p className="font-medium">Low Stock Alert</p>
                <p className="text-body-sm text-text-muted">{lowStockProducts.filter(p => p.status === 'Out of Stock').length} product(s) out of stock, {lowStockProducts.filter(p => p.status === 'Low Stock').length} running low</p>
              </div>
            </div>
            <Link to="/admin/products?stock=low">
              <Button variant="ghost" size="sm">View Products</Button>
            </Link>
          </div>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={formatCurrency(stat.value)}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Orders */}
          <Card>
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-heading-lg font-medium text-charcoal-900">Recent Orders</h2>
              <Link to="/admin/orders">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            <Table
              columns={createOrderColumns(
                (order) => console.log('View order:', order),
                (order) => console.log('Update status:', order)
              ).slice(0, 6)}
              data={recentOrders}
              keyExtractor={order => order.orderId}
              striped
              hoverable
              sortable={false}
              emptyMessage="No recent orders"
            />
          </Card>

          {/* Top Products */}
          <Card>
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-heading-lg font-medium text-charcoal-900">Top Selling Products</h2>
              <Link to="/admin/products">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            <div className="divide-y divide-border">
              {topProducts.map((product, index) => (
                <div key={product.productName} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      'w-8 h-8 rounded-lg flex items-center justify-center font-medium text-body-sm flex-shrink-0',
                      index === 0 ? 'bg-warm-500 text-white' :
                      index === 1 ? 'bg-charcoal-300 text-white' :
                      index === 2 ? 'bg-warm-600 text-white' : 'bg-charcoal-100 text-charcoal-400'
                    )}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-900">{product.productName}</p>
                      <p className="text-body-sm text-text-muted">{product.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{formatCurrency(product.revenue)}</p>
                    <p className="text-caption text-text-muted">Revenue</p>
                  </div>
                </div>
              ))}
              {topProducts.length === 0 && (
                <div className="p-8 text-center text-text-muted">No orders yet</div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <div className="p-6 border-b border-border">
              <h2 className="text-heading-lg font-medium text-charcoal-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <Link to="/admin/products/new">
                <Button variant="outline" className="w-full justify-start gap-3" leftIcon={<Package className="w-5 h-5" />}>
                  <div>
                    <p className="font-medium text-charcoal-900">Add New Product</p>
                    <p className="text-body-sm text-text-muted">Create a new cake listing</p>
                  </div>
                </Button>
              </Link>
              <Link to="/admin/categories/new">
                <Button variant="outline" className="w-full justify-start gap-3" leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}>
                  <div>
                    <p className="font-medium text-charcoal-900">Add Category</p>
                    <p className="text-body-sm text-text-muted">Organize your products</p>
                  </div>
                </Button>
              </Link>
              <Link to="/admin/pickup/new">
                <Button variant="outline" className="w-full justify-start gap-3" leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}>
                  <div>
                    <p className="font-medium text-charcoal-900">Add Pickup Schedule</p>
                    <p className="text-body-sm text-text-muted">Set available time slots</p>
                  </div>
                </Button>
              </Link>
              <Link to="/admin/orders?status=Pending">
                <Button variant="outline" className="w-full justify-start gap-3" leftIcon={<ShoppingCart className="w-5 h-5" />}>
                  <div>
                    <p className="font-medium text-charcoal-900">Process Pending Orders</p>
                    <p className="text-body-sm text-text-muted">Review and confirm new orders</p>
                  </div>
                </Button>
              </Link>
            </div>
          </Card>

          {/* Pending Pickups Today */}
          <Card>
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-heading-lg font-medium text-charcoal-900">Today's Pickups</h2>
              <Badge variant="primary">{pendingPickups.length}</Badge>
            </div>
            <div className="divide-y divide-border">
              {pendingPickups.map((pickup, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-900">{pickup.customerName}</p>
                      <p className="text-body-sm text-text-muted">{pickup.orderId.slice(-8)} • {pickup.items} item{pickup.items !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">{pickup.pickupTime}</p>
                    <Button variant="ghost" size="sm" className="mt-1">Ready</Button>
                  </div>
                </div>
              ))}
              {pendingPickups.length === 0 && (
                <div className="p-8 text-center text-text-muted">No pickups scheduled for today</div>
              )}
            </div>
          </Card>

          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <Card className="border-rose-200">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-heading-lg font-medium text-charcoal-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  Low Stock Products
                </h2>
                <Badge variant="error">{lowStockProducts.length}</Badge>
              </div>
              <div className="divide-y divide-border">
                {lowStockProducts.map((product, index) => (
                  <div key={index} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        'w-8 h-8 rounded-lg flex items-center justify-center',
                        product.status === 'Out of Stock' ? 'bg-rose-100' : 'bg-warm-100'
                      )}>
                        <svg className={clsx('w-5 h-5', product.status === 'Out of Stock' ? 'text-rose-500' : 'text-warm-500')} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8ZM12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14ZM4 20V18C4 16.34 5.34 15 7 15H17C18.66 15 20 16.34 20 18V20H4Z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-charcoal-900">{product.productName}</p>
                        <p className="text-body-sm text-text-muted">{product.category}</p>
                      </div>
                    </div>
                    <Badge variant={product.status === 'Out of Stock' ? 'error' : 'warning'}>{product.status}</Badge>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border">
                <Link to="/admin/products?stock=low">
                  <Button variant="outline" className="w-full" size="sm">View All Products</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}