// ============================================================================
// SweetCrumb Bakery - Dropdown Components
// ============================================================================

import { useRef, useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { ChevronDown, Check, X, MoreHorizontal } from 'lucide-react';
import { Button } from './Button';

// -----------------------------------------------------------------------------
// Dropdown Menu
// -----------------------------------------------------------------------------

export interface DropdownMenuItem {
  label: string;
  value: string;
  icon?: ReactNode;
  disabled?: boolean;
  dangerous?: boolean;
  onClick?: () => void;
  type?: 'button';
  className?: string;
}

export interface DropdownDividerItem {
  divider: true;
  dividerLabel?: string;
}

export type DropdownItem = DropdownMenuItem | DropdownDividerItem;

interface DropdownMenuProps {
  items: DropdownItem[];
  onSelect: (value: string, item: DropdownItem) => void;
  trigger: ReactNode;
  align?: 'left' | 'right';
  offset?: number;
  closeOnSelect?: boolean;
  className?: string;
  menuClassName?: string;
}

export function DropdownMenu({
  items,
  onSelect,
  trigger,
  align = 'right',
  offset = 4,
  closeOnSelect = true,
  className,
  menuClassName,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current?.contains(event.target as Node)) return;
      if (menuRef.current?.contains(event.target as Node)) return;
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleItemClick = (item: DropdownMenuItem) => {
    if (item.disabled) return;
    onSelect(item.value, item);
    if (item.onClick) {
      item.onClick();
    }
    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  const triggerWrap = <div className={clsx('relative inline-block', className)}>{trigger}</div>;

  if (!isOpen) {
    return triggerWrap;
  }

  const menuContent = (
    <div
      ref={menuRef}
      className={clsx(
        'dropdown-menu',
        align === 'right' ? 'right-0' : 'left-0',
        menuClassName
      )}
      style={{ marginTop: offset }}
      role="menu"
      aria-orientation="vertical"
    >
      {items.map((item, index) => {
        if ('divider' in item) {
          return (
            <div key={`divider-${index}`} className="dropdown-divider" role="separator">
              {item.dividerLabel && (
                <span className="absolute -top-2 left-3 px-2 bg-white text-caption text-text-muted">
                  {item.dividerLabel}
                </span>
              )}
            </div>
          );
        }

        return (
          <button
            key={index}
            type="button"
            role="menuitem"
            tabIndex={-1}
            disabled={item.disabled}
            onClick={() => handleItemClick(item)}
            className={clsx(
              'dropdown-item w-full',
              item.dangerous && 'text-rose-600 hover:bg-rose-50',
              item.disabled && 'opacity-50 cursor-not-allowed'
            )}
            aria-disabled={item.disabled}
          >
            {item.icon && <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>}
            <span className="flex-1">{item.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {triggerWrap}
      {createPortal(menuContent, document.body)}
    </>
  );
}

// -----------------------------------------------------------------------------
// Select Dropdown (for form selects)
// -----------------------------------------------------------------------------

interface SelectDropdownProps {
  value: string;
  placeholder?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function SelectDropdown({
  value,
  placeholder,
  options,
  onChange,
  disabled = false,
  error = false,
  className,
  'aria-label': ariaLabel,
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const highlightedIndex = useRef(-1);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current?.contains(event.target as Node)) return;
      if (menuRef.current?.contains(event.target as Node)) return;
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      const enabledOptions = options.filter(o => !o.disabled);
      const maxIndex = enabledOptions.length - 1;

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          triggerRef.current?.focus();
          break;
        case 'ArrowDown':
          event.preventDefault();
          highlightedIndex.current = Math.min(highlightedIndex.current + 1, maxIndex);
          break;
        case 'ArrowUp':
          event.preventDefault();
          highlightedIndex.current = Math.max(highlightedIndex.current - 1, 0);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (highlightedIndex.current >= 0) {
            onChange(enabledOptions[highlightedIndex.current].value);
            setIsOpen(false);
          }
          break;
        case 'Tab':
          setIsOpen(false);
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, options, onChange]);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        ref={triggerRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={clsx(
          'input w-full justify-between pr-10',
          'focus:ring-2 focus:ring-focus/20',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-error focus:border-error focus:ring-error/20',
          className
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        aria-activedescendant={isOpen && highlightedIndex.current >= 0 ? `option-${highlightedIndex.current}` : undefined}
      >
        <span className={clsx('truncate', !selectedOption && placeholder && 'text-text-muted')}>
          {selectedOption?.label || placeholder || 'Select...'}
        </span>
        <ChevronDown
          className={clsx(
            'w-4 h-4 text-text-muted flex-shrink-0 ml-2 transition-transform',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && createPortal(
        <div
          ref={menuRef}
          className="dropdown-menu right-0 left-0 max-h-60 overflow-y-auto"
          role="listbox"
          aria-label={ariaLabel}
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              id={`option-${index}`}
              type="button"
              role="option"
              tabIndex={-1}
              disabled={option.disabled}
              onClick={() => {
                if (!option.disabled) {
                  onChange(option.value);
                  setIsOpen(false);
                }
              }}
              onMouseEnter={() => { highlightedIndex.current = index; }}
              className={clsx(
                'dropdown-item w-full',
                option.value === value && 'bg-primary-light text-primary',
                option.disabled && 'opacity-50 cursor-not-allowed',
                highlightedIndex.current === index && 'bg-warm-50'
              )}
              aria-selected={option.value === value}
              aria-disabled={option.disabled}
            >
              {option.value === value && (
                <Check className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
              )}
              <span className="flex-1">{option.label}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Multi-Select Dropdown
// -----------------------------------------------------------------------------

interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectDropdownProps {
  values: string[];
  placeholder?: string;
  options: MultiSelectOption[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  'aria-label'?: string;
  maxDisplay?: number;
}

export function MultiSelectDropdown({
  values,
  placeholder,
  options,
  onChange,
  disabled = false,
  error = false,
  className,
  'aria-label': ariaLabel,
  maxDisplay = 3,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current?.contains(event.target as Node)) return;
      if (menuRef.current?.contains(event.target as Node)) return;
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleValue = (value: string) => {
    const newValues = values.includes(value)
      ? values.filter(v => v !== value)
      : [...values, value];
    onChange(newValues);
  };

  const selectedOptions = options.filter(o => values.includes(o.value));
  const displayLabels = selectedOptions.slice(0, maxDisplay).map(o => o.label);
  const remainingCount = selectedOptions.length - maxDisplay;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        ref={triggerRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={clsx(
          'input w-full justify-between pr-10 min-h-[44px]',
          'focus:ring-2 focus:ring-focus/20',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-error focus:border-error focus:ring-error/20',
          className
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {selectedOptions.length > 0 ? (
            <>
              {displayLabels.map((label) => (
                <span
                  key={label}
                  className="badge badge-primary inline-flex items-center gap-1"
                >
                  {label}
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      const option = selectedOptions.find(item => item.label === label);
                      if (option) toggleValue(option.value);
                    }}
                    className="p-0.5 rounded hover:bg-primary/20"
                    aria-label={`Remove ${label}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="badge badge-neutral">+{remainingCount} more</span>
              )}
            </>
          ) : (
            <span className="text-text-muted">{placeholder || 'Select options...'}</span>
          )}
        </div>
        <ChevronDown
          className={clsx(
            'w-4 h-4 text-text-muted flex-shrink-0 ml-2 transition-transform',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && createPortal(
        <div
          ref={menuRef}
          className="dropdown-menu right-0 left-0 max-h-60 overflow-y-auto"
          role="listbox"
          aria-label={ariaLabel}
        >
          {options.map((option) => {
            const isSelected = values.includes(option.value);
            return (
              <label
                key={option.value}
                className={clsx(
                  'dropdown-item w-full flex items-center gap-2',
                  isSelected && 'bg-primary-light text-primary',
                  option.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => !option.disabled && toggleValue(option.value)}
                  disabled={option.disabled}
                  className="h-4 w-4 text-primary border-border-strong rounded focus:ring-2 focus:ring-focus/20"
                  aria-label={option.label}
                />
                <span className="flex-1">{option.label}</span>
                {isSelected && <Check className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />}
              </label>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Action Menu (for row actions, etc.)
// -----------------------------------------------------------------------------

interface ActionMenuProps {
  items: DropdownItem[];
  onSelect: (value: string, item: DropdownItem) => void;
  align?: 'left' | 'right';
}

export function ActionMenu({ items, onSelect, align = 'right' }: ActionMenuProps) {
  return (
    <DropdownMenu
      items={items}
      onSelect={onSelect}
      align={align}
      trigger={
        <Button variant="ghost" size="icon" aria-label="More actions">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      }
    />
  );
}