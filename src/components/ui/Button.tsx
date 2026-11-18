// ============================================================================
// SweetCrumb Bakery - Button Component
// ============================================================================

import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variantStyles = {
      primary: 'bg-primary text-white hover:bg-primary-hover focus-visible:ring-primary active:bg-primary/90 shadow-card hover:shadow-lg',
      secondary: 'bg-sage-500 text-white hover:bg-sage-600 focus-visible:ring-sage-500 active:bg-sage-500/90 shadow-card hover:shadow-lg',
      outline: 'border-2 border-border-strong bg-transparent hover:bg-warm-50 focus-visible:ring-warm-500 active:bg-warm-100',
      ghost: 'bg-transparent hover:bg-warm-100 focus-visible:ring-warm-500 active:bg-warm-200 text-charcoal-700',
      destructive: 'bg-rose-500 text-white hover:bg-rose-600 focus-visible:ring-rose-500 active:bg-rose-500/90 shadow-card hover:shadow-lg',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-caption gap-1.5 rounded-lg',
      md: 'px-4 py-2.5 text-body-sm gap-2 rounded-lg',
      lg: 'px-6 py-3 text-body-lg gap-2 rounded-xl',
      icon: 'p-2.5 rounded-lg',
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], widthStyles, className)}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

// -----------------------------------------------------------------------------
// Icon Button
// -----------------------------------------------------------------------------

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  'aria-label': string;
  children: React.ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'ghost', size = 'md', 'aria-label': ariaLabel, children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size="icon"
        className={clsx(className)}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

// -----------------------------------------------------------------------------
// Button Group
// -----------------------------------------------------------------------------

interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function ButtonGroup({ children, className, orientation = 'horizontal' }: ButtonGroupProps) {
  return (
    <div
      className={clsx(
        'inline-flex rounded-lg border border-border-strong overflow-hidden',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        className
      )}
      role="group"
    >
      {children}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Toggle Button
// -----------------------------------------------------------------------------

type ToggleButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
  pressed: boolean;
  onChange?: (pressed: boolean) => void;
};

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({ pressed, onChange, className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={pressed ? 'primary' : 'outline'}
        className={clsx(className)}
        onClick={() => onChange?.(!pressed)}
        aria-pressed={pressed}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

ToggleButton.displayName = 'ToggleButton';