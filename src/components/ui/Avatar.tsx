// ============================================================================
// SweetCrumb Bakery - Avatar Components
// ============================================================================

import React, { forwardRef, useState, type HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { getInitials } from '@/types';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'busy' | 'away';
  statusPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  fallback?: React.ReactNode;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({
    src,
    alt,
    name,
    size = 'md',
    shape = 'circle',
    status,
    statusPosition = 'bottom-right',
    fallback,
    className,
    ...props
  }, ref) => {
    const [imageError, setImageError] = useState(false);

    const sizeClasses = {
      xs: 'w-6 h-6 text-[10px]',
      sm: 'w-8 h-8 text-caption',
      md: 'w-10 h-10 text-body-sm',
      lg: 'w-12 h-12 text-body',
      xl: 'w-16 h-16 text-heading-md',
      '2xl': 'w-24 h-24 text-display-sm',
    };

    const shapeClasses = {
      circle: 'rounded-full',
      square: 'rounded-xl',
    };

    const statusSizes = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-3.5 h-3.5',
      '2xl': 'w-4 h-4',
    };

    const statusColors = {
      online: 'bg-sage-500',
      offline: 'bg-charcoal-300',
      busy: 'bg-rose-500',
      away: 'bg-warm-500',
    };

    const statusPositions = {
      'bottom-right': 'bottom-0 right-0',
      'bottom-left': 'bottom-0 left-0',
      'top-right': 'top-0 right-0',
      'top-left': 'top-0 left-0',
    };

    const label = name || alt || 'User avatar';
    const initials = name ? getInitials(name.split(' ')[0] || '', name.split(' ')[1] || '') : '';

    return (
      <div ref={ref} className={clsx('relative inline-flex shrink-0', className)} {...props}>
        <div
          className={clsx(
            'overflow-hidden bg-charcoal-100 flex items-center justify-center text-white font-medium',
            'bg-gradient-to-br from-warm-200 to-warm-300',
            sizeClasses[size],
            shapeClasses[shape]
          )}
          aria-label={label}
        >
          {!src || imageError ? (
            fallback ?? (
              name ? (
                <span>{initials}</span>
              ) : (
                <svg className="w-1/2 h-1/2 text-charcoal-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )
            )
          ) : (
            <img
              src={src}
              alt={alt || name || 'Avatar'}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          )}
        </div>

        {status && (
          <span
            className={clsx(
              'absolute border-2 border-white',
              statusSizes[size],
              'rounded-full',
              statusColors[status],
              statusPositions[statusPosition]
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

interface AvatarGroupProps {
  avatars: Array<{ src?: string; name?: string; alt?: string }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export function AvatarGroup({ avatars, max = 5, size = 'md', className }: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = Math.max(avatars.length - max, 0);

  return (
    <div className={clsx('flex -space-x-2', className)} aria-label={`${avatars.length} users`}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={`${avatar.name ?? 'avatar'}-${index}`}
          src={avatar.src}
          name={avatar.name}
          alt={avatar.alt}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={clsx(
            'flex items-center justify-center border-2 border-white font-medium',
            'bg-gradient-to-br from-warm-200 to-warm-300 text-charcoal-600',
            {
              xs: 'w-6 h-6 text-[10px]',
              sm: 'w-8 h-8 text-caption',
              md: 'w-10 h-10 text-body-sm',
              lg: 'w-12 h-12 text-body',
              xl: 'w-16 h-16 text-heading-md',
              '2xl': 'w-24 h-24 text-display-sm',
            }[size]
          )}
          aria-label={`${remainingCount} more users`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

interface UserAvatarMenuProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  children: React.ReactNode;
  triggerClassName?: string;
}

export function UserAvatarMenu({ user, children, triggerClassName }: UserAvatarMenuProps) {
  return (
    <div className="relative">
      <button
        className={clsx('flex items-center gap-2 p-1 rounded-lg hover:bg-warm-100 transition-colors', triggerClassName)}
        aria-haspopup="true"
        aria-expanded="false"
      >
        <Avatar src={user.avatar} name={user.name} size="md" />
        <div className="hidden sm:block text-left">
          <p className="text-body-sm font-medium text-text-primary">{user.name}</p>
          <p className="text-caption text-text-muted">{user.email}</p>
        </div>
      </button>
      {children}
    </div>
  );
}