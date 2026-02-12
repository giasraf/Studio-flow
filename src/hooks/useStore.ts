'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import {
  getClients,
  getSongs,
  getSessions,
  getPayments,
  getStats,
  subscribe,
} from '@/lib/store';

function useStoreData<T>(key: string, getter: () => T): T {
  const [data, setData] = useState<T>(getter);

  useEffect(() => {
    // Re-fetch on mount (in case localStorage changed)
    setData(getter());

    const unsubscribe = subscribe(key, () => {
      setData(getter());
    });
    return unsubscribe;
  }, [key, getter]);

  return data;
}

export function useClients() {
  return useStoreData('clients', getClients);
}

export function useSongs() {
  return useStoreData('songs', getSongs);
}

export function useSessions() {
  return useStoreData('sessions', getSessions);
}

export function usePayments() {
  return useStoreData('payments', getPayments);
}

export function useStats() {
  return useStoreData('stats', getStats);
}
