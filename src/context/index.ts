// ============================================================================
// SweetCrumb Bakery - Context Exports
// ============================================================================

import React, { type ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { UIProvider } from './UIContext';
import { ModalProvider } from '@/components/ui';

export {
  AuthProvider,
  useAuth,
  useAuthStore,
  useAuthStoreDirect,
} from './AuthContext';

export {
  CartProvider,
  useCart,
  useCartStore,
  useCartStoreDirect,
} from './CartContext';

export {
  useToastStore,
  useNotificationStore,
  toast,
  notificationIcons,
  notificationColors,
} from './NotificationContext';

export {
  UIProvider,
  useUI,
  useUIStore,
  useUIStoreDirect,
  Modal,
  Drawer,
  type ModalConfig,
  type DrawerConfig,
  type ModalProps,
  type DrawerProps,
} from './UIContext';

interface ProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: ProvidersProps) {
  return React.createElement(
    UIProvider,
    null,
    React.createElement(
      ModalProvider,
      null,
      React.createElement(
        AuthProvider,
        null,
        React.createElement(CartProvider, null, children)
      )
    )
  );
}