import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export { prisma };

export type Database = typeof prisma;
export type { Prisma };
