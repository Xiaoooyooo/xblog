import { Database, Prisma } from "./database";

export type { Prisma };

export type AppState = {
  database: Database;
  // eslint-disable-next-line
  body: Record<string, any>;
};

export type User = {
  id: string;
  username: string;
  isAdmin: boolean;
};
