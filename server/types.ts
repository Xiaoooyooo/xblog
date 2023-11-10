import { Database } from "./database";

export type AppState = {
  database: Database;
  body: Record<string, string>;
};

export type User = {
  id: string;
  username: string;
  displayName: string;
  isAdmin: boolean;
};
