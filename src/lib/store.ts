'use client';

// Client-side reactive store using localStorage
// This enables the app to work immediately without a database
// When the DB is connected, this gets replaced with real API calls

import { mockClients, mockSongs, mockSessions, mockPayments, mockStats } from './mock-data';

const STORAGE_PREFIX = 'studioflow_';

function getStorageKey(key: string) {
  return `${STORAGE_PREFIX}${key}`;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(getStorageKey(key));
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getStorageKey(key), JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

// Event system for reactivity
type Listener = () => void;
const listeners: Map<string, Set<Listener>> = new Map();

function notify(key: string) {
  listeners.get(key)?.forEach((fn) => fn());
  // Also notify 'stats' since many changes affect stats
  if (key !== 'stats') listeners.get('stats')?.forEach((fn) => fn());
}

export function subscribe(key: string, listener: Listener): () => void {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(listener);
  return () => {
    listeners.get(key)?.delete(listener);
  };
}

// ==================== CLIENTS ====================

export function getClients() {
  return loadFromStorage('clients', mockClients);
}

export function addClient(client: {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  source?: string;
}) {
  const clients = getClients();
  const newClient = {
    id: `client-${Date.now()}`,
    name: client.name,
    email: client.email,
    phone: client.phone || '',
    source: client.source || '',
    totalPaid: 0,
    totalOwed: 0,
    projectCount: 0,
    activeProjects: 0,
    lastSession: null as string | null,
  };
  (clients as typeof newClient[]).push(newClient);
  saveToStorage('clients', clients);
  notify('clients');
  return newClient;
}

export function updateClient(id: string, updates: Partial<ReturnType<typeof getClients>[0]>) {
  const clients = getClients();
  const index = clients.findIndex((c) => c.id === id);
  if (index === -1) return null;
  clients[index] = { ...clients[index], ...updates };
  saveToStorage('clients', clients);
  notify('clients');
  return clients[index];
}

export function deleteClient(id: string) {
  const clients = getClients().filter((c) => c.id !== id);
  saveToStorage('clients', clients);
  notify('clients');
}

// ==================== SONGS ====================

export function getSongs() {
  return loadFromStorage('songs', mockSongs);
}

export function addSong(song: {
  projectId: string;
  clientId: string;
  clientName: string;
  title: string;
  genre?: string;
  bpm?: number;
  key?: string;
}) {
  const songs = getSongs();
  const newSong = {
    id: `song-${Date.now()}`,
    projectId: song.projectId,
    clientId: song.clientId,
    clientName: song.clientName,
    title: song.title,
    genre: song.genre || '',
    bpm: song.bpm || 0,
    key: song.key || '',
    stage: 'SKETCH' as const,
    sessionCount: 0,
    lastUpdated: new Date().toISOString().split('T')[0],
  };
  (songs as typeof newSong[]).push(newSong);
  saveToStorage('songs', songs);
  notify('songs');
  return newSong;
}

export function updateSongStage(songId: string, stage: string) {
  const songs = getSongs();
  const index = songs.findIndex((s) => s.id === songId);
  if (index === -1) return null;
  songs[index] = {
    ...songs[index],
    stage: stage as any,
    lastUpdated: new Date().toISOString().split('T')[0],
  };
  saveToStorage('songs', songs);
  notify('songs');
  return songs[index];
}

export function deleteSong(id: string) {
  const songs = getSongs().filter((s) => s.id !== id);
  saveToStorage('songs', songs);
  notify('songs');
}

// ==================== SESSIONS ====================

export function getSessions() {
  return loadFromStorage('sessions', mockSessions);
}

export function addSession(session: {
  songId?: string;
  songTitle: string;
  clientName: string;
  type: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  isProducerOnly: boolean;
}) {
  const sessions = getSessions();
  const newSession = {
    id: `session-${Date.now()}`,
    songId: session.songId || '',
    songTitle: session.songTitle,
    clientName: session.clientName,
    type: session.type,
    title: session.title,
    startTime: session.startTime,
    endTime: session.endTime,
    duration: session.duration,
    isProducerOnly: session.isProducerOnly,
    status: 'CONFIRMED',
  };
  (sessions as typeof newSession[]).push(newSession);
  saveToStorage('sessions', sessions);

  // Update song session count
  if (session.songId) {
    const songs = getSongs();
    const songIndex = songs.findIndex((s) => s.id === session.songId);
    if (songIndex !== -1) {
      songs[songIndex].sessionCount += 1;
      saveToStorage('songs', songs);
      notify('songs');
    }
  }

  // Update client last session
  if (session.clientName) {
    const clients = getClients();
    const clientIndex = clients.findIndex((c) => c.name === session.clientName);
    if (clientIndex !== -1) {
      clients[clientIndex].lastSession = session.startTime.split('T')[0];
      saveToStorage('clients', clients);
      notify('clients');
    }
  }

  notify('sessions');
  return newSession;
}

export function updateSessionStatus(sessionId: string, status: string) {
  const sessions = getSessions();
  const index = sessions.findIndex((s) => s.id === sessionId);
  if (index === -1) return null;
  sessions[index] = { ...sessions[index], status };
  saveToStorage('sessions', sessions);
  notify('sessions');
  return sessions[index];
}

export function deleteSession(id: string) {
  const sessions = getSessions().filter((s) => s.id !== id);
  saveToStorage('sessions', sessions);
  notify('sessions');
}

// ==================== PAYMENTS ====================

export function getPayments() {
  return loadFromStorage('payments', mockPayments);
}

export function addPayment(payment: {
  clientId: string;
  clientName: string;
  projectName: string;
  amount: number;
  type: string;
  dueDate: string;
  installmentNum?: number;
  totalInstallments?: number;
}) {
  const payments = getPayments();
  const newPayment = {
    id: `pay-${Date.now()}`,
    clientId: payment.clientId,
    clientName: payment.clientName,
    projectName: payment.projectName,
    amount: payment.amount,
    type: payment.type,
    dueDate: payment.dueDate,
    installmentNum: payment.installmentNum || 1,
    totalInstallments: payment.totalInstallments || 1,
    status: 'PENDING',
    paidAt: null as string | null,
  };
  (payments as typeof newPayment[]).push(newPayment);
  saveToStorage('payments', payments);

  // Update client owed
  const clients = getClients();
  const clientIndex = clients.findIndex((c) => c.id === payment.clientId);
  if (clientIndex !== -1) {
    clients[clientIndex].totalOwed += payment.amount;
    saveToStorage('clients', clients);
    notify('clients');
  }

  notify('payments');
  return newPayment;
}

export function markPaymentPaid(paymentId: string) {
  const payments = getPayments();
  const index = payments.findIndex((p) => p.id === paymentId);
  if (index === -1) return null;

  const payment = payments[index];
  payments[index] = {
    ...payment,
    status: 'PAID',
    paidAt: new Date().toISOString().split('T')[0],
  };
  saveToStorage('payments', payments);

  // Update client paid/owed
  const clients = getClients();
  const clientIndex = clients.findIndex((c) => c.id === payment.clientId);
  if (clientIndex !== -1) {
    clients[clientIndex].totalPaid += payment.amount;
    clients[clientIndex].totalOwed = Math.max(0, clients[clientIndex].totalOwed - payment.amount);
    saveToStorage('clients', clients);
    notify('clients');
  }

  notify('payments');
  return payments[index];
}

// ==================== STATS ====================

export function getStats() {
  const clients = getClients();
  const songs = getSongs();
  const sessions = getSessions();
  const payments = getPayments();

  const totalPaid = payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = payments
    .filter((p) => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0);

  const overduePayments = payments
    .filter((p) => p.status === 'OVERDUE')
    .reduce((sum, p) => sum + p.amount, 0);

  const activeClients = clients.filter((c) => c.activeProjects > 0).length || clients.filter((c) => c.totalOwed > 0).length;
  const activeSongs = songs.filter((s) => s.stage !== 'DELIVERED').length;
  const completedSongs = songs.filter((s) => s.stage === 'DELIVERED').length;

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const sessionsThisWeek = sessions.filter((s) => new Date(s.startTime) >= weekStart).length;
  const sessionsThisMonth = sessions.filter((s) => new Date(s.startTime) >= monthStart).length;

  const avgSessionsPerSong = songs.length > 0
    ? songs.reduce((sum, s) => sum + s.sessionCount, 0) / songs.length
    : 0;

  const avgRevenuePerSong = completedSongs > 0
    ? totalPaid / Math.max(completedSongs, 1)
    : totalPaid / Math.max(songs.length, 1);

  return {
    totalRevenue: totalPaid,
    monthlyRevenue: totalPaid, // Simplified for MVP
    pendingPayments,
    overduePayments,
    activeClients: activeClients || clients.length,
    totalClients: clients.length,
    activeSongs,
    completedSongs,
    sessionsThisWeek,
    sessionsThisMonth,
    avgSessionsPerSong: Number(avgSessionsPerSong.toFixed(1)),
    avgRevenuePerSong: Math.round(avgRevenuePerSong),
  };
}

// ==================== RESET ====================

export function resetAllData() {
  if (typeof window === 'undefined') return;
  const keys = ['clients', 'songs', 'sessions', 'payments'];
  keys.forEach((key) => localStorage.removeItem(getStorageKey(key)));
  notify('clients');
  notify('songs');
  notify('sessions');
  notify('payments');
}
