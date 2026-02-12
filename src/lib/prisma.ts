// Prisma client singleton - will be activated when DB is connected
// For now the app uses localStorage via store.ts

// import { PrismaClient } from '@prisma/client';
//
// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };
//
// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
//   });
//
// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
