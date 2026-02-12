export type Locale = 'he' | 'en';

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatar?: string;
  role: 'PRODUCER' | 'CLIENT';
  locale: Locale;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalPaid: number;
  totalOwed: number;
  projectCount: number;
  activeProjects: number;
  lastSession?: string;
  source?: string;
}

export type SongStage =
  | 'SKETCH'
  | 'PRODUCTION'
  | 'RECORDING'
  | 'EDITING'
  | 'MIXING'
  | 'MIX_REVISIONS'
  | 'MASTERING'
  | 'DELIVERED';

export interface Song {
  id: string;
  projectId: string;
  clientId: string;
  clientName: string;
  title: string;
  stage: SongStage;
  genre?: string;
  bpm?: number;
  key?: string;
  sessionCount: number;
  lastUpdated: string;
}

export interface Session {
  id: string;
  songId: string;
  songTitle: string;
  clientName: string;
  type: string;
  status: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  isProducerOnly: boolean;
}

export interface Payment {
  id: string;
  clientId: string;
  clientName: string;
  projectName: string;
  amount: number;
  type: string;
  status: string;
  dueDate: string;
  paidAt?: string | null;
  installmentNum?: number;
  totalInstallments?: number;
}
