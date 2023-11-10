import { Database } from "./database";

export type AppState = {
  database: Database;
  body?: Record<string, string>;
};
