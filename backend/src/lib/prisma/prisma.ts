import { PrismaClient, Prisma, Game } from "@prisma/client";

export const prisma = new PrismaClient();
export { Prisma, Game };
