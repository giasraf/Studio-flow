import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  notes: z.string().optional(),
  source: z.string().optional(),
});

export const createProjectSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  name: z.string().min(1, 'Project name is required'),
  type: z.enum(['SINGLE', 'ALBUM', 'EP']),
  totalPrice: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export const createSongSchema = z.object({
  projectId: z.string().min(1, 'Project is required'),
  title: z.string().min(1, 'Song title is required'),
  genre: z.string().optional(),
  bpm: z.number().min(20).max(300).optional(),
  key: z.string().optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export const updateSongStageSchema = z.object({
  songId: z.string().min(1),
  stage: z.enum([
    'SKETCH',
    'PRODUCTION',
    'RECORDING',
    'EDITING',
    'MIXING',
    'MIX_REVISIONS',
    'MASTERING',
    'DELIVERED',
  ]),
});

export const createSessionSchema = z.object({
  songId: z.string().optional(),
  type: z.enum([
    'SKETCH',
    'PRODUCTION',
    'RECORDING',
    'EDITING',
    'MIXING',
    'MIX_REVISION',
    'MASTERING',
    'CONSULTATION',
  ]),
  title: z.string().min(1, 'Title is required'),
  startTime: z.string().min(1, 'Start time is required'),
  duration: z.number().min(30).max(480),
  isProducerOnly: z.boolean().default(false),
  notes: z.string().optional(),
});

export const createPaymentSchema = z.object({
  clientId: z.string().min(1),
  projectId: z.string().min(1),
  amount: z.number().min(1, 'Amount must be positive'),
  type: z.enum(['ADVANCE', 'INSTALLMENT', 'FINAL']),
  dueDate: z.string().min(1),
  installmentNum: z.number().optional(),
  totalInstallments: z.number().optional(),
});

export const markPaymentPaidSchema = z.object({
  paymentId: z.string().min(1),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type CreateSongInput = z.infer<typeof createSongSchema>;
export type UpdateSongStageInput = z.infer<typeof updateSongStageSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
