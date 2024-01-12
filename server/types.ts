import { ParameterizedContext, DefaultContext } from "koa";
import { Database, Prisma } from "./database";

export type { Prisma };

export type AppState = {
  database: Database;
  // eslint-disable-next-line
  body: Record<string, any>;
};

/* eslint-disable-next-line @typescript-eslint/ban-types */
export type AppContext<S = {}, C = DefaultContext> = ParameterizedContext<
  AppState & S
>;

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
