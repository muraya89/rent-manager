import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// globalthis is a shared storage area for the running app. We use it to remember whether a Prisma client already exists
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// reuse the existing Prisma client if it exists, otherwise create a new one
function createPrismaClient() {
  const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

  return new PrismaClient({ adapter });
}

// create a new Prisma client if one doesn't already exist, otherwise reuse the existing one
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// During development, save the Prisma client in the global object so that it can be reused across module reloads caused by HMR (Hot Module Replacement).
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
