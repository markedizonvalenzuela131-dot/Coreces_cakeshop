// ============================================================================
// SweetCrumb Bakery - Notification Context
// Toast notifications and in-app notifications
// ============================================================================

import { create } from 'zustand';
import type { NotificationSummary, NotificationType } from '@/types';

// -----------------------------------------------------------------------------
// Toast Store (for sonner-style toasts)
// -----------------------------------------------------------------------------

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  dismissAll: () => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = { ...toast, id };
    set({ toasts: [...get().toasts, newToast] });

    // Auto-dismiss
    const duration = toast.duration ?? (toast.type === 'loading' ? Infinity : 5000);
    if (duration !== Infinity) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }

    return id;
  },

  removeToast: (id) => {
    set({ toasts: get().toasts.filter(t => t.id !== id) });
  },

  dismissAll: () => set({ toasts: [] }),
}));

// -----------------------------------------------------------------------------
// In-App Notification Store
// -----------------------------------------------------------------------------

interface NotificationState {
  notifications: NotificationSummary[];
  unreadCount: number;
  isLoading: boolean;

  // Actions
  setNotifications: (notifications: NotificationSummary[]) => void;
  addNotification: (notification: NotificationSummary) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  setLoading: (loading: boolean) => void;
  fetchNotifications: (_customerId: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  setNotifications: (notifications) => {
    const unread = notifications.filter(n => !n.isRead).length;
    set({ notifications, unreadCount: unread });
  },

  addNotification: (notification) => {
    const { notifications } = get();
    set({
      notifications: [notification, ...notifications],
      unreadCount: get().unreadCount + (notification.isRead ? 0 : 1),
    });
  },

  markAsRead: (notificationId) => {
    const { notifications } = get();
    const updated = notifications.map(n =>
      n.notificationId === notificationId ? { ...n, isRead: true } : n
    );
    const unread = updated.filter(n => !n.isRead).length;
    set({ notifications: updated, unreadCount: unread });
  },

  markAllAsRead: () => {
    const { notifications } = get();
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    set({ notifications: updated, unreadCount: 0 });
  },

  removeNotification: (notificationId) => {
    const { notifications } = get();
    const updated = notifications.filter(n => n.notificationId !== notificationId);
    const unread = updated.filter(n => !n.isRead).length;
    set({ notifications: updated, unreadCount: unread });
  },

  setLoading: (isLoading) => set({ isLoading }),

  fetchNotifications: async (_customerId) => {
    set({ isLoading: true });
    try {
      // TODO: Replace with actual API call
      // const data = await api.notifications.getByCustomer(customerId);
      // get().setNotifications(data);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));

// -----------------------------------------------------------------------------
// Convenience Functions
// -----------------------------------------------------------------------------

export const toast = {
  success: (title: string, description?: string) =>
    useToastStore.getState().addToast({ type: 'success', title, description }),

  error: (title: string, description?: string) =>
    useToastStore.getState().addToast({ type: 'error', title, description }),

  warning: (title: string, description?: string) =>
    useToastStore.getState().addToast({ type: 'warning', title, description }),

  info: (title: string, description?: string) =>
    useToastStore.getState().addToast({ type: 'info', title, description }),

  loading: (title: string, description?: string) =>
    useToastStore.getState().addToast({ type: 'loading', title, description, duration: Infinity }),

  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) => {
    const toastId = toast.loading(loading);
    return promise
      .then((data) => {
        useToastStore.getState().removeToast(toastId);
        const message = typeof success === 'function' ? success(data) : success;
        toast.success(message);
        return data;
      })
      .catch((err) => {
        useToastStore.getState().removeToast(toastId);
        const message = typeof error === 'function' ? error(err) : error;
        toast.error(message);
        throw err;
      });
  },
};

// Notification type helpers
export const notificationIcons: Record<NotificationType, string> = {
  'Order Confirmation': 'package',
  'Status Update': 'refresh-cw',
  'Ready for Pickup': 'truck',
  'Promotion': 'gift',
  'System': 'info',
};

export const notificationColors: Record<NotificationType, string> = {
  'Order Confirmation': 'text-sage-700 bg-sage-50 border-sage-200',
  'Status Update': 'text-warm-700 bg-warm-50 border-warm-200',
  'Ready for Pickup': 'text-primary bg-primary-light border-primary/20',
  'Promotion': 'text-rose-700 bg-rose-50 border-rose-200',
  'System': 'text-charcoal-700 bg-charcoal-100 border-charcoal-200',
};