import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia, TimeSpan } from "lucia";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { TB_sessions, TB_users } from "db";

export const createAuth = (db: PostgresJsDatabase) => {
  const adapter = new DrizzlePostgreSQLAdapter(db, TB_sessions, TB_users);
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
