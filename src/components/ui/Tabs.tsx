// ============================================================================
// SweetCrumb Bakery - Tabs Components
// ============================================================================

import React, { useState, type ReactNode } from 'react';
import { clsx } from 'clsx';

// -----------------------------------------------------------------------------
// Tabs
// -----------------------------------------------------------------------------

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'segmented';
  fullWidth?: boolean;
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  fullWidth = false,
  className,
}: TabsProps) {
  const variantStyles = {
    default: 'bg-warm-100 rounded-lg p-1',
    pills: 'bg-transparent',
    underline: 'bg-transparent border-b border-border',
    segmented: 'bg-warm-100 rounded-lg p-1',
  };

  const tabBaseStyles = 'flex items-center justify-center gap-1.5 font-medium text-body-sm transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const tabVariantStyles = {
    default: {
      base: `${tabBaseStyles} px-4 py-2 rounded-md`,
      active: 'bg-white text-primary shadow-sm',
      inactive: 'text-text-secondary hover:text-text-primary',
    },
    pills: {
      base: `${tabBaseStyles} px-4 py-2 rounded-lg`,
      active: 'bg-primary text-white',
      inactive: 'text-text-secondary hover:bg-warm-100 hover:text-text-primary',
    },
    underline: {
      base: `${tabBaseStyles} px-4 py-3 border-b-2 -mb-px`,
      active: 'border-primary text-primary',
      inactive: 'border-transparent text-text-secondary hover:text-text-primary hover:border-warm-300',
    },
    segmented: {
      base: `${tabBaseStyles} px-4 py-2 rounded-md flex-1`,
      active: 'bg-white text-primary shadow-sm',
      inactive: 'text-text-secondary hover:text-text-primary',
    },
  };

  const styles = tabVariantStyles[variant];
  const containerStyles = variantStyles[variant];

  return (
    <div className={clsx('w-full', className)} role="tablist" aria-orientation="horizontal">
      <div className={clsx(containerStyles, fullWidth && variant === 'segmented' && 'flex')} role="presentation">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.id}-panel`}
              id={`${tab.id}-trigger`}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && onChange(tab.id)}
              className={clsx(
                styles.base,
                isActive ? styles.active : styles.inactive,
                fullWidth && variant === 'segmented' && 'flex-1'
              )}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge != null && (
                <span className={clsx(
                  'badge px-1.5 py-0.5 text-[10px]',
                  isActive ? 'bg-primary/20 text-primary' : 'bg-charcoal-200 text-charcoal-600'
                )}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Tab Panels
// -----------------------------------------------------------------------------

interface TabPanelsProps {
  children: ReactNode;
  className?: string;
}

export function TabPanels({ children, className }: TabPanelsProps) {
  return <div className={clsx('mt-4', className)}>{children}</div>;
}

interface TabPanelProps {
  id: string;
  active: boolean;
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export function TabPanel({ id, active, children, className, animate = true }: TabPanelProps) {
  if (!active) return null;

  return (
    <div
      role="tabpanel"
      id={`${id}-panel`}
      aria-labelledby={`${id}-trigger`}
      className={clsx(
        animate ? 'animate-fade-in' : '',
        className
      )}
    >
      {children}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Tabs Compound Component
// -----------------------------------------------------------------------------

interface TabsCompoundProps {
  defaultValue: string;
  onChange?: (value: string) => void;
  children: ReactNode;
  variant?: 'default' | 'pills' | 'underline' | 'segmented';
  fullWidth?: boolean;
  className?: string;
}

export function TabsCompound({
  defaultValue,
  onChange,
  children,
  variant = 'default',
  fullWidth = false,
  className,
}: TabsCompoundProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  // We need to extract tabs and panels from children
  // This is a simplified version - in practice you'd use a context
  return (
    <div className={className}>
      {React.Children.toArray(children).map(child => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child as React.ReactElement<any>, {
          activeTab,
          onChange: handleChange,
          variant,
          fullWidth,
        });
      })}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Tabs List (for compound pattern)
// -----------------------------------------------------------------------------

interface TabsListProps {
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'segmented';
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
}

export function TabsList({ activeTab, onChange, variant, fullWidth, children, className }: TabsListProps) {
  const tabs = React.Children.toArray(children)
    .flatMap(child => {
      if (!React.isValidElement(child)) return [];
      const props = child.props as Partial<TabItem>;
      if (!props.id || !props.label) return [];
      return [{
        id: props.id,
        label: props.label,
        icon: props.icon,
        disabled: props.disabled,
        badge: props.badge,
      } satisfies TabItem];
    });

  return (
    <Tabs
      tabs={tabs}
      activeTab={activeTab}
      onChange={onChange}
      variant={variant}
      fullWidth={fullWidth}
      className={className}
    />
  );
}

// -----------------------------------------------------------------------------
// Tab Trigger (for compound pattern)
// -----------------------------------------------------------------------------

interface TabTriggerProps {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export function TabTrigger(_props: TabTriggerProps) {
  // This is just a placeholder - actual rendering happens in TabsList
  return null;
}

// -----------------------------------------------------------------------------
// Tab Content (for compound pattern)
// -----------------------------------------------------------------------------

interface TabContentProps {
  id: string;
  activeTab: string;
  children: ReactNode;
  className?: string;
}

export function TabContent({ id, activeTab, children, className }: TabContentProps) {
  const isActive = activeTab === id;
  if (!isActive) return null;

  return (
    <TabPanel id={id} active={true} className={className}>
      {children}
    </TabPanel>
  );
}

// Helper hook for compound tabs
export function useTabs(defaultValue: string, onChange?: (value: string) => void) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return { activeTab, onChange: handleChange };
}