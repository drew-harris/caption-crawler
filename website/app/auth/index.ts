import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia, TimeSpan } from "lucia";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { sessionTable, userTable } from "db";

export const createAuth = (db: DrizzleD1Database) => {
  const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);
  const lucia = new Lucia(adapter, {
    sessionExpiresIn: new TimeSpan(9, "w"),
    getUserAttributes(databaseUserAttributes) {
      return {
        isGoogle: databaseUserAttributes.isGoogle,
        isPro: databaseUserAttributes.isPro,
        createdAt: new Date(databaseUserAttributes.createdAt),
      };
    },
  });
  return lucia;
};
