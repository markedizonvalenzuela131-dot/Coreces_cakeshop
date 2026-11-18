// ============================================================================
// SweetCrumb Bakery - Cart Context
// Shopping cart state management using Zustand
// ============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Cart, CartItemWithProduct, CakeProduct } from '@/types';

// -----------------------------------------------------------------------------
// Cart Store
// -----------------------------------------------------------------------------

interface CartState {
  cart: Cart | null;
  items: CartItemWithProduct[];
  isLoading: boolean;
  error: string | null;

  // Computed
  itemCount: number;
  subtotal: number;

  // Actions
  setCart: (cart: Cart | null) => void;
  setItems: (items: CartItemWithProduct[]) => void;
  addItem: (product: CakeProduct, quantity?: number) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  syncWithServer: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      items: [],
      isLoading: false,
      error: null,

      get itemCount() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      get subtotal() {
        return get().items.reduce((sum, item) => sum + item.subtotalCalculation, 0);
      },

      setCart: (cart) => set({ cart }),

      setItems: (items) => set({ items }),

      addItem: (product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(item => item.productId === product.productId);

        if (existingItem) {
          // Update quantity of existing item
          const newQuantity = existingItem.quantity + quantity;
          get().updateQuantity(existingItem.cartItemId, newQuantity);
        } else {
          // Add new item
          const newItem: CartItemWithProduct = {
            cartItemId: `temp-${Date.now()}`,
            cartId: get().cart?.cartId || 'temp-cart',
            productId: product.productId,
            quantity,
            subtotalCalculation: product.price * quantity,
            product,
          };
          set({ items: [...items, newItem] });
        }
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }

        const { items } = get();
        const updatedItems = items.map(item => {
          if (item.cartItemId === cartItemId) {
            const product = item.product;
            return {
              ...item,
              quantity,
              subtotalCalculation: product ? product.price * quantity : 0,
            };
          }
          return item;
        });
        set({ items: updatedItems });
      },

      removeItem: (cartItemId) => {
        const { items } = get();
        set({ items: items.filter(item => item.cartItemId !== cartItemId) });
      },

      clearCart: () => set({ items: [], cart: null }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      syncWithServer: async () => {
        // TODO: Implement server sync
        // const { cart, items } = get();
        // if (cart) {
        //   await api.cart.sync(cart.cartId, items);
        // }
      },
    }),
    {
      name: 'sweetcrumb-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        cart: state.cart,
      }),
    }
  )
);

// -----------------------------------------------------------------------------
// Cart Context (for React components)
// -----------------------------------------------------------------------------

import { createContext, useContext, type ReactNode } from 'react';

interface CartContextValue {
  cart: Cart | null;
  items: CartItemWithProduct[];
  itemCount: number;
  subtotal: number;
  isLoading: boolean;
  error: string | null;
  addItem: (product: CakeProduct, quantity?: number) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const {
    cart,
    items,
    itemCount,
    subtotal,
    isLoading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCartStore();

  const value: CartContextValue = {
    cart,
    items,
    itemCount,
    subtotal,
    isLoading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// -----------------------------------------------------------------------------
// Hook for direct store access
// -----------------------------------------------------------------------------

export function useCartStoreDirect() {
  return useCartStore();
}