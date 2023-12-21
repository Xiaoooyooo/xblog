import { Database, Prisma } from "./database";

export type { Prisma };

export type AppState = {
  database: Database;
  // eslint-disable-next-line
  body: Record<string, any>;
};

export type User = {
  id: string;
  isAdmin: boolean | null;
  username: string;
  displayName: string | null;
};

export type Profile = {
  avatar: string | null;
  introduction: string | null;
  resume: string | null;
};

export type Blog = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  isDraft: boolean;
  views: number;
};

export type Category = {
  id: string;
  name: string;
};
