import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { sessionTable, userTable } from "db";

export const createAuth = (db: DrizzleD1Database) => {
  const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);
  const lucia = new Lucia(adapter, {});
  return lucia;
};
