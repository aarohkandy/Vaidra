// Prisma client will be generated after database setup
// For now, using a placeholder to allow builds
let PrismaClient: any
try {
  const prismaModule = require('@prisma/client')
  PrismaClient = prismaModule.PrismaClient
} catch {
  // Prisma not generated yet
}

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

export const prisma = PrismaClient 
  ? (globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl: process.env.DATABASE_URL }))
  : null

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma
}

