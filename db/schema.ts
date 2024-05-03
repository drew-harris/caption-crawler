import {
  pgTable,
  text,
  timestamp,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";

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

export const TB_playlists = pgTable("playlist", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  originalUrl: text("original_url").notNull().unique(),
  channelId: text("channel_id").notNull(),
  channelTitle: text("channel_title").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  description: text("description").notNull(),
});

export const TB_videos = pgTable("video", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => TB_users.id),
  playlistId: text("playlist_id")
    .notNull()
    .references(() => TB_playlists.id),
});
