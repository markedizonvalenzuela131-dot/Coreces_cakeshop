// ============================================================================
// SweetCrumb Bakery - UI Context
// Global UI state: modals, sidebars, drawers, theme, etc.
// ============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createContext, useContext, type ReactNode, type ReactElement } from 'react';

// -----------------------------------------------------------------------------
// Modal Types
// -----------------------------------------------------------------------------

export interface ModalConfig {
  id: string;
  component: ReactElement;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

interface OpenModal extends ModalConfig {
  isOpen: true;
}

interface ClosedModal {
  isOpen: false;
  id: string | null;
}

type ModalState = OpenModal | ClosedModal;

// -----------------------------------------------------------------------------
// Drawer/Sidebar Types
// -----------------------------------------------------------------------------

export type DrawerPosition = 'left' | 'right' | 'bottom';

export interface DrawerConfig {
  id: string;
  component: ReactElement;
  position?: DrawerPosition;
  size?: 'sm' | 'md' | 'lg' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

interface OpenDrawer extends DrawerConfig {
  isOpen: true;
}

interface ClosedDrawer {
  isOpen: false;
  id: string | null;
}

type DrawerState = OpenDrawer | ClosedDrawer;

// -----------------------------------------------------------------------------
// UI Store
// -----------------------------------------------------------------------------

interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;

  // Modals
  modal: ModalState;
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;

  // Drawers
  drawer: DrawerState;
  openDrawer: (config: DrawerConfig) => void;
  closeDrawer: () => void;

  // Sidebar (admin)
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Mobile menu
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;

  // Search
  searchOpen: boolean;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;

  // Loading states
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;

  // Scroll lock
  scrollLocked: boolean;
  lockScroll: () => void;
  unlockScroll: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'system',
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
        set({ theme: newTheme });
        applyTheme(newTheme);
      },

      // Modals
      modal: { isOpen: false, id: null },
      openModal: (config) => {
        set({
          modal: { ...config, isOpen: true },
          scrollLocked: true,
        });
        lockBodyScroll();
      },
      closeModal: () => {
        set({ modal: { isOpen: false, id: null }, scrollLocked: false });
        unlockBodyScroll();
      },

      // Drawers
      drawer: { isOpen: false, id: null },
      openDrawer: (config) => {
        set({
          drawer: { ...config, isOpen: true },
          scrollLocked: true,
        });
        lockBodyScroll();
      },
      closeDrawer: () => {
        set({ drawer: { isOpen: false, id: null }, scrollLocked: false });
        unlockBodyScroll();
      },

      // Sidebar
      sidebarOpen: true,
      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Mobile menu
      mobileMenuOpen: false,
      toggleMobileMenu: () => set(state => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

      // Search
      searchOpen: false,
      toggleSearch: () => set(state => ({ searchOpen: !state.searchOpen })),
      setSearchOpen: (open) => set({ searchOpen: open }),

      // Global loading
      globalLoading: false,
      setGlobalLoading: (loading) => set({ globalLoading: loading }),

      // Scroll lock
      scrollLocked: false,
      lockScroll: () => {
        set({ scrollLocked: true });
        lockBodyScroll();
      },
      unlockScroll: () => {
        set({ scrollLocked: false });
        unlockBodyScroll();
      },
    }),
    {
      name: 'sweetcrumb-ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

// -----------------------------------------------------------------------------
// Theme Application
// -----------------------------------------------------------------------------

function applyTheme(theme: 'light' | 'dark' | 'system'): void {
  const root = document.documentElement;

  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  } else {
    root.classList.toggle('dark', theme === 'dark');
  }
}

function lockBodyScroll(): void {
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${getScrollbarWidth()}px`;
}

function unlockBodyScroll(): void {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}

function getScrollbarWidth(): number {
  return window.innerWidth - document.documentElement.clientWidth;
}

// Initialize theme on load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('sweetcrumb-ui');
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      applyTheme(state.theme || 'system');
    } catch {
      applyTheme('system');
    }
  } else {
    applyTheme('system');
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const { theme } = useUIStore.getState();
    if (theme === 'system') {
      document.documentElement.classList.toggle('dark', e.matches);
    }
  });
}

// -----------------------------------------------------------------------------
// React Context
// -----------------------------------------------------------------------------

interface UIContextValue {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;

  modal: ModalState;
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;

  drawer: DrawerState;
  openDrawer: (config: DrawerConfig) => void;
  closeDrawer: () => void;

  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;

  searchOpen: boolean;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;

  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;

  scrollLocked: boolean;
  lockScroll: () => void;
  unlockScroll: () => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const {
    theme,
    setTheme,
    toggleTheme,
    modal,
    openModal,
    closeModal,
    drawer,
    openDrawer,
    closeDrawer,
    sidebarOpen,
    toggleSidebar,
    setSidebarOpen,
    mobileMenuOpen,
    toggleMobileMenu,
    setMobileMenuOpen,
    searchOpen,
    toggleSearch,
    setSearchOpen,
    globalLoading,
    setGlobalLoading,
    scrollLocked,
    lockScroll,
    unlockScroll,
  } = useUIStore();

  const value: UIContextValue = {
    theme,
    setTheme,
    toggleTheme,
    modal,
    openModal,
    closeModal,
    drawer,
    openDrawer,
    closeDrawer,
    sidebarOpen,
    toggleSidebar,
    setSidebarOpen,
    mobileMenuOpen,
    toggleMobileMenu,
    setMobileMenuOpen,
    searchOpen,
    toggleSearch,
    setSearchOpen,
    globalLoading,
    setGlobalLoading,
    scrollLocked,
    lockScroll,
    unlockScroll,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}

// -----------------------------------------------------------------------------
// Hook for direct store access
// -----------------------------------------------------------------------------

export function useUIStoreDirect() {
  return useUIStore();
}

// -----------------------------------------------------------------------------
// Modal Component Wrapper
// -----------------------------------------------------------------------------

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: ReactNode;
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  children,
  showCloseButton = true,
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]',
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined} aria-describedby={description ? 'modal-description' : undefined}>
      <div className={`modal-content ${sizeClasses[size]}`} onClick={e => e.stopPropagation()}>
        {(title || showCloseButton) && (
          <div className="modal-header">
            <div>
              {title && <h2 id="modal-title" className="text-heading-lg font-medium">{title}</h2>}
              {description && <p id="modal-description" className="text-body-sm text-text-muted mt-1">{description}</p>}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="btn-ghost btn-icon p-2 rounded-lg text-text-muted hover:text-text-primary"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Drawer Component Wrapper
// -----------------------------------------------------------------------------

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'full';
  title?: string;
  children: ReactNode;
}

export function Drawer({
  isOpen,
  onClose,
  position = 'right',
  size = 'md',
  title,
  children,
}: DrawerProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: position === 'bottom' ? 'h-[30vh]' : 'w-[30vw] min-w-[280px]',
    md: position === 'bottom' ? 'h-[50vh]' : 'w-[50vw] min-w-[320px]',
    lg: position === 'bottom' ? 'h-[70vh]' : 'w-[70vw] min-w-[380px]',
    full: position === 'bottom' ? 'h-[90vh]' : 'w-[90vw]',
  };

  const positionClasses = {
    left: 'left-0',
    right: 'right-0',
    bottom: 'bottom-0 left-0 right-0',
  };

  const animationClasses = {
    left: 'animate-slide-in-left',
    right: 'animate-slide-in-right',
    bottom: 'animate-slide-in-bottom',
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-modal flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={`
          bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col
          ${positionClasses[position]} ${sizeClasses[size]} ${animationClasses[position]}
          ${position === 'bottom' ? 'rounded-t-2xl' : 'rounded-lg'}
        `}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-heading-md font-medium">{title}</h2>
            <button
              onClick={onClose}
              className="btn-ghost btn-icon p-2 rounded-lg text-text-muted hover:text-text-primary"
              aria-label="Close drawer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}

// Add these animations to your CSS if not already present
/*
@keyframes slide-in-left {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
@keyframes slide-in-right {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
@keyframes slide-in-bottom {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slide-in-left { animation: slide-in-left 300ms cubic-bezier(0.16, 1, 0.3, 1); }
.animate-slide-in-right { animation: slide-in-right 300ms cubic-bezier(0.16, 1, 0.3, 1); }
.animate-slide-in-bottom { animation: slide-in-bottom 300ms cubic-bezier(0.16, 1, 0.3, 1); }
*/