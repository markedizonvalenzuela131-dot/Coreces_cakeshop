// ============================================================================
// SweetCrumb Bakery - Admin Analytics Page (Refactored)
// ============================================================================

import React, { useState, useMemo } from 'react';
import { Download, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Award, Target } from 'lucide-react';
import { Button, Select, Card, Badge } from '@/components/ui';
import { LineChartComponent, BarChartComponent, PieChartComponent, formatters } from '@/components/charts';
import { clsx } from 'clsx';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { useAdminOrders } from '@/hooks';
import { useProducts } from '@/hooks';
import { StatCard } from '@/components/common';

// -----------------------------------------------------------------------------
// Analytics Page
// -----------------------------------------------------------------------------

export function Analytics() {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [metricView, setMetricView] = useState<'revenue' | 'orders' | 'both'>('both');

  const { filteredOrders } = useAdminOrders();
  const { products } = useProducts();

  const periodLabels = { week: 'This Week', month: 'This Month', quarter: 'This Quarter', year: 'This Year' };

  // Calculate metrics from real data
  const totalRevenue = useMemo(() => filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0), [filteredOrders]);
  const totalOrders = useMemo(() => filteredOrders.length, [filteredOrders]);
  const avgOrderValue = useMemo(() => totalOrders > 0 ? totalRevenue / totalOrders : 0, [totalRevenue, totalOrders]);
  const avgDailyRevenue = useMemo(() => filteredOrders.length > 0 ? totalRevenue / Math.max(1, new Set(filteredOrders.map(o => o.orderDate.split('T')[0])).size) : 0, [filteredOrders]);
  const activeCustomers = useMemo(() => new Set(filteredOrders.map(o => o.customerName)).size, [filteredOrders]);
  const retentionRate = 68; // Mock for now

  // Revenue data for charts
  const revenueData = useMemo(() => {
    const dailyMap = new Map<string, { revenue: number; orders: number }>();
    filteredOrders.forEach(order => {
      const date = order.orderDate.split('T')[0];
      const existing = dailyMap.get(date) || { revenue: 0, orders: 0 };
      existing.revenue += order.totalAmount;
      existing.orders += 1;
      dailyMap.set(date, existing);
    });
    return Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-30)
      .map(([date, data]) => ({ date, ...data }));
  }, [filteredOrders]);

  // Orders by status
  const ordersByStatus = useMemo(() => {
    const statusMap = new Map<string, number>();
    filteredOrders.forEach(order => {
      statusMap.set(order.statusName, (statusMap.get(order.statusName) || 0) + 1);
    });
    const statusColors: Record<string, string> = {
      'Pending': '#FADCCF',
      'Confirmed': '#C2D9C2',
      'Preparing': '#96C096',
      'Ready for Pickup': '#6E6E6E',
      'Completed': '#4D854D',
      'Cancelled': '#F5A6A6',
    };
    return Array.from(statusMap.entries()).map(([name, value]) => ({
      name,
      value,
      color: statusColors[name] || '#FADCCF',
    }));
  }, [filteredOrders]);

  // Revenue by category
  const revenueByCategory = useMemo(() => {
    const categoryMap = new Map<string, { revenue: number; orders: number }>();
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const existing = categoryMap.get(item.categoryName || 'Uncategorized') || { revenue: 0, orders: 0 };
        existing.revenue += item.lineTotal;
        existing.orders += item.quantity;
        categoryMap.set(item.categoryName || 'Uncategorized', existing);
      });
    });
    return Array.from(categoryMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders]);

  // Top products
  const topProducts = useMemo(() => {
    const productMap = new Map<string, { orders: number; revenue: number; avgRating: number }>();
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const existing = productMap.get(item.productName) || { orders: 0, revenue: 0, avgRating: 4.5 };
        existing.orders += item.quantity;
        existing.revenue += item.lineTotal;
        productMap.set(item.productName, existing);
      });
    });
    return Array.from(productMap.entries())
      .map(([productName, data]) => ({ productName, ...data }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);
  }, [filteredOrders]);

  // Weekly comparison (mock for now - would need historical data)
  const weeklyComparison = useMemo(() => [
    { name: 'Week 1', week: 'Week 1', revenue: 3200000, orders: 95 },
    { name: 'Week 2', week: 'Week 2', revenue: 4100000, orders: 120 },
    { name: 'Week 3', week: 'Week 3', revenue: 3800000, orders: 110 },
    { name: 'Week 4', week: 'Week 4', revenue: 4500000, orders: 135 },
  ], []);

  // Customer metrics (mock)
  const customerMetrics = useMemo(() => [
    { name: 'New Customers', value: '42', change: '+15%', trend: 'up' as const },
    { name: 'Returning Customers', value: '156', change: '+8%', trend: 'up' as const },
    { name: 'Avg Orders per Customer', value: totalOrders > 0 ? (totalOrders / Math.max(1, activeCustomers)).toFixed(1) : '0', change: '-0.1', trend: 'down' as const },
    { name: 'Customer Retention', value: `${retentionRate}%`, change: '+3%', trend: 'up' as const },
  ], [totalOrders, activeCustomers]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-display-md font-display font-medium text-charcoal-900">Analytics</h1>
          <p className="text-body text-text-muted mt-1">Track your bakery's performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={dateRange}
            onChange={(event) => setDateRange(event.target.value as typeof dateRange)}
            options={[
              { value: 'week', label: 'Last 7 Days' },
              { value: 'month', label: 'Last 30 Days' },
              { value: 'quarter', label: 'Last 90 Days' },
              { value: 'year', label: 'Last Year' },
            ]}
            className="w-auto sm:w-48"
          />
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          change="+12.5%"
          changeType="positive"
          icon={<DollarSign className="w-6 h-6" />}
          subtitle={`${periodLabels[dateRange]} • ${formatters.currencyShort(avgDailyRevenue)}/day avg`}
        />
        <StatCard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          change="+8.2%"
          changeType="positive"
          icon={<ShoppingCart className="w-6 h-6" />}
          subtitle={`${periodLabels[dateRange]} • ${(totalOrders / Math.max(1, revenueData.length)).toFixed(1)} orders/day avg`}
        />
        <StatCard
          title="Avg Order Value"
          value={formatCurrency(Math.round(avgOrderValue))}
          change="-2.1%"
          changeType="negative"
          icon={<Target className="w-6 h-6" />}
          subtitle={`${periodLabels[dateRange]} • Target: ₱500+`}
        />
        <StatCard
          title="Active Customers"
          value={activeCustomers.toString()}
          change="+15.3%"
          changeType="positive"
          icon={<Users className="w-6 h-6" />}
          subtitle={`${periodLabels[dateRange]} • ${retentionRate}% retention rate`}
        />
      </div>

      {/* Customer Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {customerMetrics.map((metric, index) => (
          <Card key={index} className="text-center p-6">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3',
              metric.trend === 'up' ? 'bg-sage-100' : 'bg-warm-100'
            )}>
              {metric.trend === 'up' ? <TrendingUp className="w-5 h-5 text-sage-600" /> : <TrendingDown className="w-5 h-5 text-warm-600" />}
            </div>
            <p className="text-display-sm font-semibold text-charcoal-900">{metric.value}</p>
            <p className="text-caption text-text-muted">{metric.name}</p>
            <Badge variant={metric.trend === 'up' ? 'success' : 'warning'} className="mt-2">{metric.change}</Badge>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-heading-lg font-medium text-charcoal-900">Revenue Trend</h2>
            <Select
              value={metricView}
              onChange={(event) => setMetricView(event.target.value as typeof metricView)}
              options={[
                { value: 'revenue', label: 'Revenue' },
                { value: 'orders', label: 'Orders' },
                { value: 'both', label: 'Both' },
              ]}
              className="w-auto"
            />
          </div>
          <div className="p-6">
            {metricView === 'revenue' && (
              <LineChartComponent
                data={revenueData.map(d => ({ name: formatDate(d.date), Revenue: d.revenue }))}
                xKey="name"
                lines={[{ key: 'Revenue', name: 'Revenue', color: '#EC7A4E' }]}
                height={300}
                formatter={formatters.currency}
              />
            )}
            {metricView === 'orders' && (
              <LineChartComponent
                data={revenueData.map(d => ({ name: formatDate(d.date), Orders: d.orders }))}
                xKey="name"
                lines={[{ key: 'Orders', name: 'Orders', color: '#4D854D' }]}
                height={300}
                formatter={formatters.number}
              />
            )}
            {metricView === 'both' && (
              <LineChartComponent
                data={revenueData.map(d => ({ name: formatDate(d.date), Revenue: d.revenue, Orders: d.orders * 10000 }))}
                xKey="name"
                lines={[
                  { key: 'Revenue', name: 'Revenue (₱)', color: '#EC7A4E' },
                  { key: 'Orders', name: 'Orders (×10K)', color: '#4D854D' },
                ]}
                height={300}
                formatter={formatters.currency}
              />
            )}
            {revenueData.length === 0 && (
              <div className="h-80 flex items-center justify-center text-text-muted">No data for selected period</div>
            )}
          </div>
        </Card>

        {/* Orders by Status */}
        <Card>
          <div className="p-6 border-b border-border">
            <h2 className="text-heading-lg font-medium text-charcoal-900">Orders by Status</h2>
          </div>
          <div className="p-6">
            {ordersByStatus.length > 0 ? (
              <>
                <PieChartComponent
                  data={ordersByStatus.map(s => ({ name: s.name, value: s.value }))}
                  height={300}
                  innerRadius={70}
                  formatter={formatters.number}
                />
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ordersByStatus.map((status) => (
                    <div key={status.name} className="flex items-center gap-2 p-2 bg-warm-50 rounded-lg">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                      <span className="text-body-sm font-medium text-charcoal-900">{status.name}</span>
                      <span className="text-body-sm text-text-muted ml-auto">{status.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-80 flex items-center justify-center text-text-muted">No order data</div>
            )}
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue by Category */}
        <Card>
          <div className="p-6 border-b border-border">
            <h2 className="text-heading-lg font-medium text-charcoal-900">Revenue by Category</h2>
          </div>
          <div className="p-6">
            {revenueByCategory.length > 0 ? (
              <BarChartComponent
                data={revenueByCategory.map(d => ({ name: d.name, Revenue: d.revenue, Orders: d.orders }))}
                xKey="name"
                bars={[
                  { key: 'Revenue', name: 'Revenue', color: '#EC7A4E' },
                  { key: 'Orders', name: 'Orders', color: '#4D854D' },
                ]}
                height={350}
                horizontal
                formatter={formatters.currency}
              />
            ) : (
              <div className="h-96 flex items-center justify-center text-text-muted">No category data</div>
            )}
          </div>
        </Card>

        {/* Weekly Comparison */}
        <Card>
          <div className="p-6 border-b border-border">
            <h2 className="text-heading-lg font-medium text-charcoal-900">Weekly Comparison</h2>
          </div>
          <div className="p-6">
            <BarChartComponent
              data={weeklyComparison}
              xKey="name"
              bars={[
                { key: 'revenue', name: 'Revenue', color: '#EC7A4E' },
                { key: 'orders', name: 'Orders', color: '#4D854D' },
              ]}
              height={350}
              stacked={false}
              formatter={value => value > 1000 ? formatters.currencyShort(value) : formatters.number(value)}
            />
          </div>
        </Card>
      </div>

      {/* Top Products Table */}
      <Card>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-heading-lg font-medium text-charcoal-900">Top Products</h2>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-caption font-medium text-text-secondary uppercase tracking-wider">Rank</th>
                <th className="px-4 py-3 text-left text-caption font-medium text-text-secondary uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-right text-caption font-medium text-text-secondary uppercase tracking-wider">Orders</th>
                <th className="px-4 py-3 text-right text-caption font-medium text-text-secondary uppercase tracking-wider">Revenue</th>
                <th className="px-4 py-3 text-center text-caption font-medium text-text-secondary uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topProducts.map((product, index) => (
                <tr key={product.productName} className="hover:bg-warm-50/50">
                  <td className="px-4 py-3">
                    <span className={cn('w-8 h-8 rounded-lg flex items-center justify-center font-medium text-body-sm',
                      index === 0 ? 'bg-warm-500 text-white' :
                      index === 1 ? 'bg-charcoal-300 text-white' :
                      index === 2 ? 'bg-warm-600 text-white' : 'bg-charcoal-100 text-charcoal-400'
                    )}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-charcoal-900">{product.productName}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-charcoal-900">{product.orders}</td>
                  <td className="px-4 py-3 text-right font-semibold text-primary">{formatCurrency(product.revenue)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <svg className="w-4 h-4 fill-warm-500 text-warm-500" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      <span className="font-medium text-charcoal-900">{product.avgRating.toFixed(1)}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {topProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-muted">No product data for this period</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Insights */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="border-sage-200">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-sage-600" />
              </div>
              <div>
                <h3 className="font-medium text-charcoal-900">Revenue Growth</h3>
                <p className="text-body-sm text-text-muted">Week over week</p>
              </div>
            </div>
            <p className="text-display-md font-semibold text-sage-600">+12.5%</p>
            <p className="text-body-sm text-text-muted">Revenue increased compared to last period. Wedding cakes driving growth.</p>
          </div>
        </Card>

        <Card className="border-warm-200">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-warm-100 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-warm-600" />
              </div>
              <div>
                <h3 className="font-medium text-charcoal-900">Avg Order Value</h3>
                <p className="text-body-sm text-text-muted">Slight decline</p>
              </div>
            </div>
            <p className="text-display-md font-semibold text-warm-600">-2.1%</p>
            <p className="text-body-sm text-text-muted">Customers ordering smaller cakes. Consider bundle promotions.</p>
          </div>
        </Card>

        <Card className="border-primary-light">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-charcoal-900">Top Performer</h3>
                <p className="text-body-sm text-text-muted">This period</p>
              </div>
            </div>
            <p className="text-heading-md font-semibold text-primary">{topProducts[0]?.productName || 'Classic Chocolate Fudge'}</p>
            <p className="text-body-sm text-text-muted">{topProducts[0] ? `₱${(topProducts[0].revenue / 1000000).toFixed(2)}M revenue • ${topProducts[0].orders} orders • ${topProducts[0].avgRating}★ rating` : 'No data'}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}