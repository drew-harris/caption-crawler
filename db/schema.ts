import {
  index,
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  unique,
} from "drizzle-orm/pg-core";

export const TB_users = pgTable("user", {
  id: text("id").primaryKey(),
  isGoogle: boolean("is_google").default(false).notNull(),
  isPro: boolean("is_pro").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  videoCount: integer("video_count").notNull().default(0),
  videoLimit: integer("video_limit").notNull().default(0),
});

export const TB_sessions = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => TB_users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const TB_collections = pgTable("collections", {
  id: text("id").primaryKey(),
  type: text("type").$type<"playlist" | "channel">().default("playlist"),
  semantic: boolean("semantic").default(false),
  youtubeId: text("youtube_id")
    .notNull()
    .references(() => TB_metadata.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  originalUrl: text("original_url").notNull(),
  createdBy: text("created_by")
    .notNull()
    .references(() => TB_users.id),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  videoCount: integer("video_count").notNull().default(0), // Kinda unused rn
});

export const TB_metadata = pgTable("metadata", {
  id: text("id").primaryKey(), // Same as youtube id
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url").notNull(),
  channelId: text("channel_id").notNull(),
  channelTitle: text("channel_title").notNull(),
});

export const TB_videos = pgTable(
  "video",
  {
    id: text("id").primaryKey(),
    youtubeId: text("youtube_id").notNull(),
    title: text("title").notNull(),
    collectionId: text("collection_id")
      .notNull()
      .references(() => TB_collections.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    thumbnailUrl: text("thumbnail_url").notNull(),
  },
  (table) => {
    return {
      youtubeIdx: index("youtube_vid_idx").on(table.youtubeId),
      pairedVidAndCollection: unique("paired_vid_and_collection").on(
        table.youtubeId,
        table.collectionId,
      ),
    };
  },
);
