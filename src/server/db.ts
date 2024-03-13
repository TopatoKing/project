import { PrismaClient } from "@prisma/client";

import { env } from "@/env";

// This is a global variable we'll use to store a reference to the Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// If the global variable already has a value, use it. Otherwise, create a new Prisma Client
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
