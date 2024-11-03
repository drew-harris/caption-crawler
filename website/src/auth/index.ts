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
        googleId: databaseUserAttributes.googleId,
        isPro: databaseUserAttributes.isPro,
        createdAt: new Date(databaseUserAttributes.createdAt),
        isAdmin: databaseUserAttributes.isAdmin,
        videoCount: databaseUserAttributes.videoCount,
        videoLimit: databaseUserAttributes.videoLimit,
      };
    },
  });
  return lucia;
};

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof createAuth>;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  googleId: string | null;
  createdAt: Date;
  isPro: boolean;
  isAdmin: boolean;
  videoCount: number;
  videoLimit: number;
}
