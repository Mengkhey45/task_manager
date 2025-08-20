// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // Allow global prisma to persist across hot reloads in dev
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({ log: ['query', 'error'] });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
