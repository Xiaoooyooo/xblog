import { Database } from "./database";

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
