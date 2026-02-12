import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'ILS'): string {
  return new Intl.NumberFormat(currency === 'ILS' ? 'he-IL' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string, locale: string = 'he'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === 'he' ? 'he-IL' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function formatTime(date: Date | string, locale: string = 'he'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === 'he' ? 'he-IL' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getStageColor(stage: string): string {
  const colors: Record<string, string> = {
    SKETCH: 'bg-purple-100 text-purple-800',
    PRODUCTION: 'bg-blue-100 text-blue-800',
    RECORDING: 'bg-orange-100 text-orange-800',
    EDITING: 'bg-yellow-100 text-yellow-800',
    MIXING: 'bg-cyan-100 text-cyan-800',
    MIX_REVISIONS: 'bg-teal-100 text-teal-800',
    MASTERING: 'bg-pink-100 text-pink-800',
    DELIVERED: 'bg-green-100 text-green-800',
  };
  return colors[stage] || 'bg-gray-100 text-gray-800';
}

export function getPaymentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    OVERDUE: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
    REFUNDED: 'bg-purple-100 text-purple-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
