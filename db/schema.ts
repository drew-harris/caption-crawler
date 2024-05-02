import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const TB_users = pgTable("user", {
  id: text("id").primaryKey(),
  isGoogle: boolean("is_google").default(false).notNull(),
  isPro: boolean("is_pro").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull(),
});

export const TB_sessions = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => TB_users.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
