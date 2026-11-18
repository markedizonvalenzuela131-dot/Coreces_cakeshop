// ============================================================================
// SweetCrumb Bakery - Shared Utilities
// ============================================================================

/// <reference types="vite/client" />

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { OrderStatusName, AvailabilityStatus } from '@/types';

// -----------------------------------------------------------------------------
// Class Name Utility
// -----------------------------------------------------------------------------

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// -----------------------------------------------------------------------------
// Currency Formatting
// -----------------------------------------------------------------------------

export function formatCurrency(
  amount: number,
  options: {
    currency?: string;
    locale?: string;
    showSymbol?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const {
    currency = 'PHP',
    locale = 'en-PH',
    showSymbol = true,
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: showSymbol ? 'currency' : 'decimal',
    currency: showSymbol ? currency : undefined,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
}

export function formatCurrencyCompact(
  amount: number,
  options: { currency?: string; locale?: string } = {}
): string {
  const { currency = 'PHP', locale = 'en-PH' } = options;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    compactDisplay: 'short',
  }).format(amount);
}

// -----------------------------------------------------------------------------
// Date Formatting
// -----------------------------------------------------------------------------

export function formatDate(
  dateString: string,
  options: {
    format?: 'short' | 'medium' | 'long' | 'full';
    locale?: string;
    timeZone?: string;
  } = {}
): string {
  const { format = 'medium', locale = 'en-PH', timeZone = 'Asia/Manila' } = options;

  const date = new Date(dateString);

  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone,
  };

  switch (format) {
    case 'short':
      Object.assign(formatOptions, { month: 'short', day: 'numeric', year: '2-digit' });
      break;
    case 'medium':
      Object.assign(formatOptions, { month: 'short', day: 'numeric', year: 'numeric' });
      break;
    case 'long':
      Object.assign(formatOptions, { month: 'long', day: 'numeric', year: 'numeric' });
      break;
    case 'full':
      Object.assign(formatOptions, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      break;
  }

  return new Intl.DateTimeFormat(locale, formatOptions).format(date);
}

export function formatDateTime(
  dateString: string,
  options: { locale?: string; timeZone?: string } = {}
): string {
  const { locale = 'en-PH', timeZone = 'Asia/Manila' } = options;

  return new Intl.DateTimeFormat(locale, {
    timeZone,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

// -----------------------------------------------------------------------------
// Time Formatting
// -----------------------------------------------------------------------------

export function formatTime(
  timeStr: string,
  options: { format?: '12h' | '24h'; showSeconds?: boolean } = {}
): string {
  const { format = '12h' } = options;

  const formatSingleTime = (value: string): string => {
    const [hours, minutes] = value.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return value;

    if (format === '24h') {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  if (timeStr.includes('-')) {
    const [start, end] = timeStr.split('-');
    return `${formatSingleTime(start)}-${formatSingleTime(end)}`;
  }

  return formatSingleTime(timeStr);
}

export function parseTimeSlot(timeStr: string): { start: string; end: string } | null {
  if (!timeStr.includes('-')) return null;
  const [start, end] = timeStr.split('-');
  return { start, end };
}

export function isTimeSlotAvailable(schedule: { currentOrders: number; maxOrders: number }): boolean {
  return schedule.currentOrders < schedule.maxOrders;
}

// -----------------------------------------------------------------------------
// Number Utilities
// -----------------------------------------------------------------------------

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function formatNumber(value: number, options: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat('en-PH', options).format(value);
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-PH', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
}

// -----------------------------------------------------------------------------
// String Utilities
// -----------------------------------------------------------------------------

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function titleCase(text: string): string {
  return text.replace(/\w\S*/g, (word) => capitalize(word));
}

export function generateId(prefix = '', length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = prefix;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}${random}`;
}

// -----------------------------------------------------------------------------
// Array & Object Utilities
// -----------------------------------------------------------------------------

export function groupBy<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    (groups[key] = groups[key] || []).push(item);
    return groups;
  }, {} as Record<K, T[]>);
}

export function sortBy<T>(
  array: T[],
  keyFn: (item: T) => string | number,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = keyFn(a);
    const bVal = keyFn(b);
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

export function uniqueBy<T, K>(array: T[], keyFn: (item: T) => K): T[] {
  const seen = new Set<K>();
  return array.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// -----------------------------------------------------------------------------
// Status & Color Utilities
// -----------------------------------------------------------------------------

export const ORDER_STATUS_COLORS: Record<OrderStatusName, string> = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  Confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  Preparing: 'bg-purple-100 text-purple-800 border-purple-200',
  'Ready for Pickup': 'bg-green-100 text-green-800 border-green-200',
  Completed: 'bg-gray-100 text-gray-800 border-gray-200',
  Cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export const ORDER_STATUS_ICONS: Record<OrderStatusName, string> = {
  Pending: 'Clock',
  Confirmed: 'CheckCircle',
  Preparing: 'ChefHat',
  'Ready for Pickup': 'PackageCheck',
  Completed: 'CheckCircle2',
  Cancelled: 'XCircle',
};

export const AVAILABILITY_COLORS: Record<AvailabilityStatus, string> = {
  Available: 'bg-green-100 text-green-800 border-green-200',
  Limited: 'bg-amber-100 text-amber-800 border-amber-200',
  'Out of Stock': 'bg-red-100 text-red-800 border-red-200',
  Discontinued: 'bg-gray-100 text-gray-800 border-gray-200',
};

export function getOrderStatusColor(status: OrderStatusName): string {
  return ORDER_STATUS_COLORS[status] || ORDER_STATUS_COLORS.Pending;
}

export function getAvailabilityColor(status: AvailabilityStatus): string {
  return AVAILABILITY_COLORS[status] || AVAILABILITY_COLORS.Available;
}

export function getStatusProgress(status: OrderStatusName): number {
  const progressMap: Record<OrderStatusName, number> = {
    Pending: 10,
    Confirmed: 30,
    Preparing: 50,
    'Ready for Pickup': 80,
    Completed: 100,
    Cancelled: 0,
  };
  return progressMap[status] || 0;
}

// -----------------------------------------------------------------------------
// Validation Utilities
// -----------------------------------------------------------------------------

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------------
// File & Image Utilities
// -----------------------------------------------------------------------------

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

export function createObjectUrl(file: File): string {
  return URL.createObjectURL(file);
}

export function revokeObjectUrl(url: string): void {
  URL.revokeObjectURL(url);
}

// -----------------------------------------------------------------------------
// Local Storage Utilities
// -----------------------------------------------------------------------------

export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setToLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors (e.g., quota exceeded)
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

// -----------------------------------------------------------------------------
// Debounce & Throttle
// -----------------------------------------------------------------------------

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// -----------------------------------------------------------------------------
// Order Calculation Utilities
// -----------------------------------------------------------------------------

export interface OrderItemInput {
  quantity: number;
  unitPrice: number;
}

export function calculateSubtotal(items: OrderItemInput[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export function calculateTax(subtotal: number, taxRate = 0.12): number {
  return roundTo(subtotal * taxRate, 2);
}

export function calculateDeliveryFee(
  subtotal: number,
  freeDeliveryThreshold = 50000,
  deliveryFee = 10000
): number {
  return subtotal >= freeDeliveryThreshold ? 0 : deliveryFee;
}

export function calculateOrderTotal(
  items: OrderItemInput[],
  options: { taxRate?: number; freeDeliveryThreshold?: number; deliveryFee?: number } = {}
): { subtotal: number; tax: number; deliveryFee: number; total: number } {
  const { taxRate = 0.12, freeDeliveryThreshold = 50000, deliveryFee = 10000 } = options;
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal, taxRate);
  const delivery = calculateDeliveryFee(subtotal, freeDeliveryThreshold, deliveryFee);
  const total = subtotal + tax + delivery;
  return { subtotal, tax, deliveryFee: delivery, total };
}

// -----------------------------------------------------------------------------
// Query String Utilities
// -----------------------------------------------------------------------------

export function parseQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
}

// -----------------------------------------------------------------------------
// Environment Utilities
// -----------------------------------------------------------------------------

export function isDevelopment(): boolean {
  return import.meta.env.DEV;
}

export function isProduction(): boolean {
  return import.meta.env.PROD;
}

export function getEnvVar(key: string, defaultValue = ''): string {
  return import.meta.env[key] || defaultValue;
}

// -----------------------------------------------------------------------------
// Deep Clone
// -----------------------------------------------------------------------------

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (obj instanceof Object) {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

// -----------------------------------------------------------------------------
// Retry Utility
// -----------------------------------------------------------------------------

export async function retry<T>(
  fn: () => Promise<T>,
  options: { retries?: number; delay?: number; backoff?: number } = {}
): Promise<T> {
  const { retries = 3, delay = 1000, backoff = 2 } = options;
  let lastError: Error;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < retries) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(backoff, i)));
      }
    }
  }

  throw lastError!;
}

// -----------------------------------------------------------------------------
// File Download Utility
// -----------------------------------------------------------------------------

export function downloadFile(filename: string, content: string, mimeType = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// -----------------------------------------------------------------------------
// Calendar Utilities
// -----------------------------------------------------------------------------

export function toCalendarDate(date: string, time: string): string {
  // Convert YYYY-MM-DD and HH:MM to ICS format: YYYYMMDDTHHMMSS
  const [year, month, day] = date.split('-');
  const [hours, minutes] = time.split(':');
  return `${year}${month}${day}T${hours}${minutes}00`;
}

export function escapeCalendarText(text: string): string {
  // Escape special characters for ICS format
  return text
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}