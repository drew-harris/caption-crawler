import { drizzle } from "drizzle-orm/d1";

export const createDb = (cfdb: D1Database) => {
  const db = drizzle(cfdb);
  return db;
};
