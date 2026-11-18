// ============================================================================
// SweetCrumb Bakery - Auth Context
// Authentication state management using React Context + Zustand
// ============================================================================

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser, UserRole, CustomerLoginData, AdminLoginData, CustomerRegistrationData } from '@/types';

// -----------------------------------------------------------------------------
// Auth Store (Zustand)
// -----------------------------------------------------------------------------

interface AuthState {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: CustomerLoginData | AdminLoginData, role: UserRole) => Promise<void>;
  register: (data: CustomerRegistrationData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  clearError: () => void;
  setUser: (user: AuthUser | null, role: UserRole | null) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (_credentials, role) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call
          // const response = await api.auth.login(credentials, role);

          // Mock implementation for demo
          await new Promise(resolve => setTimeout(resolve, 800));

          if (role === 'customer') {
            const mockUser: AuthUser = {
              id: 'cust-1',
              role: 'customer',
              name: 'Maria Santos',
              email: 'maria@example.com',
            };
            set({ user: mockUser, role: 'customer', isAuthenticated: true, isLoading: false });
          } else {
            const mockUser: AuthUser = {
              id: 'admin-1',
              role: 'admin',
              name: 'Admin User',
              email: 'admin@sweetcrumb.com',
            };
            set({ user: mockUser, role: 'admin', isAuthenticated: true, isLoading: false });
          }
        } catch (_error) {
          set({ error: 'Invalid credentials', isLoading: false });
          throw _error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 800));

          const mockUser: AuthUser = {
            id: `cust-${Date.now()}`,
            role: 'customer',
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
          };
          set({ user: mockUser, role: 'customer', isAuthenticated: true, isLoading: false });
        } catch (_error) {
          set({ error: 'Registration failed', isLoading: false });
          throw _error;
        }
      },

      logout: () => {
        set({ user: null, role: null, isAuthenticated: false, error: null });
      },

      updateProfile: async (data) => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true });
        try {
          // TODO: Replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 500));

          set({ user: { ...user, ...data }, isLoading: false });
        } catch (_error) {
          set({ error: 'Failed to update profile', isLoading: false });
          throw _error;
        }
      },

      clearError: () => set({ error: null }),

      setUser: (user, role) => {
        set({
          user,
          role,
          isAuthenticated: !!user,
          isLoading: false
        });
      },

      initializeAuth: async () => {
        // Check for stored session on app load
        const storedUser = get().user;
        const storedRole = get().role;

        if (storedUser && storedRole) {
          set({ isAuthenticated: true, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'sweetcrumb-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// -----------------------------------------------------------------------------
// React Context (for components that need context)
// -----------------------------------------------------------------------------

interface AuthContextValue {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: CustomerLoginData | AdminLoginData, role: UserRole) => Promise<void>;
  register: (data: CustomerRegistrationData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user,
    role,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    initializeAuth,
  } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const value: AuthContextValue = {
    user,
    role,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// -----------------------------------------------------------------------------
// Hook for components that need store directly
// -----------------------------------------------------------------------------

export function useAuthStoreDirect() {
  return useAuthStore();
}