// ============================================================================
// SweetCrumb Bakery - Breadcrumb Component
// ============================================================================

import { type ReactNode } from 'react';
import { clsx } from 'clsx';
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// -----------------------------------------------------------------------------
// Breadcrumb Item
// -----------------------------------------------------------------------------

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
  icon?: ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function Breadcrumb({ items, separator, className, ariaLabel = 'Breadcrumb' }: BreadcrumbProps) {
  return (
    <nav aria-label={ariaLabel} className={clsx('flex items-center gap-1.5 text-body-sm', className)}>
      <ol className="flex items-center gap-1.5 flex-wrap" role="list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = item.current || isLast;

          return (
            <li key={item.label} className="flex items-center gap-1.5" aria-current={isCurrent ? 'page' : undefined}>
              {index > 0 && (
                <span className="text-text-muted flex-shrink-0" aria-hidden="true">
                  {separator || <ChevronRight className="w-4 h-4" />}
                </span>
              )}
              {isCurrent ? (
                <span className="font-medium text-text-primary truncate max-w-[200px]">
                  {item.icon && <span className="inline-flex mr-1">{item.icon}</span>}
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  to={item.href}
                  className="text-text-muted hover:text-primary transition-colors flex items-center gap-1 whitespace-nowrap"
                >
                  {item.icon && <span className="inline-flex">{item.icon}</span>}
                  {item.label}
                </Link>
              ) : (
                <span className="text-text-secondary">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// -----------------------------------------------------------------------------
// Auto Breadcrumb (generates from route)
// -----------------------------------------------------------------------------

const routeLabels: Record<string, string> = {
  '/': 'Home',
  '/catalog': 'Catalog',
  '/cart': 'Cart',
  '/checkout': 'Checkout',
  '/orders': 'My Orders',
  '/orders/': 'Order Details',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/admin': 'Admin Dashboard',
  '/admin/products': 'Products',
  '/admin/orders': 'Orders',
  '/admin/categories': 'Categories',
  '/admin/pickup': 'Pickup Schedule',
  '/admin/analytics': 'Analytics',
  '/admin/settings': 'Settings',
  '/login': 'Login',
  '/register': 'Register',
};

function getRouteSegments(pathname: string): string[] {
  return pathname.split('/').filter(Boolean);
}

function buildBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const segments = getRouteSegments(pathname);
  const items: BreadcrumbItem[] = [{ label: 'Home', href: '/', icon: <Home className="w-4 h-4" /> }];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const fullPath = currentPath;

    // Check for dynamic routes (like /orders/:id)
    let label = routeLabels[fullPath];
    if (!label) {
      // Try to find parent route
      const parentPath = '/' + fullPath.split('/').slice(0, -1).join('/');
      const parentLabel = routeLabels[parentPath] || routeLabels[parentPath + '/*'];
      if (parentLabel && parentPath !== '/') {
        label = segment.charAt(0).toUpperCase() + segment.slice(1);
      } else {
        label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      }
    }

    items.push({
      label,
      href: fullPath === pathname ? undefined : fullPath,
      current: fullPath === pathname,
    });
  }

  return items;
}

export function AutoBreadcrumb({ className, separator, ...props }: Omit<BreadcrumbProps, 'items'>) {
  const location = useLocation();
  const items = buildBreadcrumbItems(location.pathname);

  return <Breadcrumb items={items} separator={separator} className={className} {...props} />;
}

// -----------------------------------------------------------------------------
// Breadcrumb with Actions
// -----------------------------------------------------------------------------

interface BreadcrumbWithActionsProps extends BreadcrumbProps {
  actions?: ReactNode;
}

export function BreadcrumbWithActions({ items, actions, separator, className, ...props }: BreadcrumbWithActionsProps) {
  return (
    <div className={clsx('flex flex-col sm:flex-row sm:items-center justify-between gap-3', className)}>
      <Breadcrumb items={items} separator={separator} {...props} />
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}