// ============================================================================
// SweetCrumb Bakery - Alert & Toast Components
// ============================================================================

import React, { forwardRef, HTMLAttributes, useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from './Button';

// -----------------------------------------------------------------------------
// Alert
// -----------------------------------------------------------------------------

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  description?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({
    variant = 'info',
    title,
    description,
    dismissible = false,
    onDismiss,
    icon,
    action,
    className,
    children,
    role = 'alert',
    ...props
  }, ref) => {
    const variantStyles = {
      info: 'bg-sage-50 border-sage-200 text-sage-800',
      success: 'bg-sage-50 border-sage-200 text-sage-800',
      warning: 'bg-warm-50 border-warm-200 text-warm-800',
      error: 'bg-rose-50 border-rose-200 text-rose-800',
    };

    const variantIcons = {
      info: <Info className="w-5 h-5 text-sage-600" />,
      success: <CheckCircle className="w-5 h-5 text-sage-600" />,
      warning: <AlertTriangle className="w-5 h-5 text-warm-600" />,
      error: <AlertCircle className="w-5 h-5 text-rose-600" />,
    };

    return (
      <div
        ref={ref}
        role={role}
        className={clsx(
          'alert flex items-start gap-3 p-4 rounded-lg border',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <div className="flex-shrink-0 mt-0.5">
          {icon || variantIcons[variant]}
        </div>
        <div className="flex-1 min-w-0">
          {title && <h4 className="font-medium text-text-primary">{title}</h4>}
          <div className={clsx('text-body-sm', title && 'mt-1')}>
            {description || children}
          </div>
          {action && <div className="mt-3">{action}</div>}
        </div>
        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className={clsx(
              'flex-shrink-0 p-1 rounded-lg transition-colors',
              'hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
              variant === 'error' && 'hover:bg-rose-100',
              variant === 'warning' && 'hover:bg-warm-100',
              variant === 'success' && 'hover:bg-sage-100',
              variant === 'info' && 'hover:bg-sage-100'
            )}
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

// -----------------------------------------------------------------------------
// Inline Alert (for forms)
// -----------------------------------------------------------------------------

interface InlineAlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  message: string;
  className?: string;
}

export function InlineAlert({ variant = 'error', message, className }: InlineAlertProps) {
  return (
    <Alert variant={variant} className={clsx('p-3 text-body-sm', className)}>
      {message}
    </Alert>
  );
}

// -----------------------------------------------------------------------------
// Toast (using sonner-style but custom)
// -----------------------------------------------------------------------------

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  title: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Toast({
  id,
  type,
  title,
  description,
  duration = 5000,
  onClose,
  action,
}: ToastProps) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (duration !== Infinity) {
      const timer = setTimeout(() => {
        setExiting(true);
        setTimeout(() => {
          setVisible(false);
          onClose(id);
        }, 200);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  if (!visible) return null;

  const typeStyles = {
    success: 'bg-white border-sage-200 shadow-lg',
    error: 'bg-white border-rose-200 shadow-lg',
    warning: 'bg-white border-warm-200 shadow-lg',
    info: 'bg-white border-sage-200 shadow-lg',
    loading: 'bg-white border-charcoal-200 shadow-lg',
  };

  const typeIcons = {
    success: <CheckCircle className="w-5 h-5 text-sage-600" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600" />,
    warning: <AlertTriangle className="w-5 h-5 text-warm-600" />,
    info: <Info className="w-5 h-5 text-sage-600" />,
    loading: (
      <svg className="animate-spin w-5 h-5 text-primary" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    ),
  };

  const typeBorders = {
    success: 'border-l-4 border-sage-500',
    error: 'border-l-4 border-rose-500',
    warning: 'border-l-4 border-warm-500',
    info: 'border-l-4 border-sage-500',
    loading: 'border-l-4 border-primary',
  };

  return (
    <div
      className={clsx(
        'flex items-start gap-3 p-4 rounded-lg border min-w-[300px] max-w-md',
        'animate-slide-in-right',
        exiting && 'animate-fade-out',
        typeStyles[type],
        typeBorders[type]
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex-shrink-0 mt-0.5">{typeIcons[type]}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-text-primary">{title}</p>
        {description && <p className="text-body-sm text-text-muted mt-1">{description}</p>}
        {action && (
          <Button variant="ghost" size="sm" onClick={action.onClick} className="mt-2">
            {action.label}
          </Button>
        )}
      </div>
      <button
        onClick={() => {
          setExiting(true);
          setTimeout(() => onClose(id), 200);
        }}
        className="flex-shrink-0 p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-charcoal-100 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Toast Container
// -----------------------------------------------------------------------------

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info' | 'loading';
    title: string;
    description?: string;
    duration?: number;
    action?: { label: string; onClick: () => void };
  }>;
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export function ToastContainer({
  toasts,
  onClose,
  position = 'top-right',
}: ToastContainerProps) {
  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <div
      className={clsx(
        'fixed z-toast flex flex-col gap-2 pointer-events-none',
        positionStyles[position]
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Banner (for top-of-page announcements)
// -----------------------------------------------------------------------------

interface BannerProps {
  variant?: 'info' | 'success' | 'warning' | 'error' | 'promo';
  message: string;
  action?: { label: string; onClick: () => void };
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export function Banner({
  variant = 'info',
  message,
  action,
  dismissible = false,
  onDismiss,
  className,
}: BannerProps) {
  const variantStyles = {
    info: 'bg-sage-50 border-sage-200 text-sage-800',
    success: 'bg-sage-50 border-sage-200 text-sage-800',
    warning: 'bg-warm-50 border-warm-200 text-warm-800',
    error: 'bg-rose-50 border-rose-200 text-rose-800',
    promo: 'bg-primary text-white',
  };

  return (
    <div
      className={clsx(
        'border-b px-4 py-3',
        variantStyles[variant],
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="container-page flex items-center justify-between gap-4">
        <p className="text-body text-center flex-1">{message}</p>
        {action && (
          <Button
            variant={variant === 'promo' ? 'outline' : 'secondary'}
            size="sm"
            onClick={action.onClick}
            className={variant === 'promo' ? 'border-white text-white hover:bg-white/10' : ''}
          >
            {action.label}
          </Button>
        )}
        {dismissible && (
          <button
            onClick={onDismiss}
            className={clsx(
              'flex-shrink-0 p-1 rounded-lg transition-colors',
              variant === 'promo'
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-text-muted hover:text-text-primary hover:bg-charcoal-100'
            )}
            aria-label="Dismiss announcement"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}