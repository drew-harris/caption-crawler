import { InferSelectModel } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { TB_collections } from "db";

export enum JobType {
  PLAYLIST_INGEST = "playlistIngest",
}

type BaseJob = {
  type: JobType;
};

export type PlaylistIngestJob = BaseJob & {
  type: JobType.PLAYLIST_INGEST;
  collection: Collection;
};

// Add other job types here
export type PossibleJob = PlaylistIngestJob;

// export type CreatedPlaylist = {
//   description: string | null;
//   id: string;
//   title: string;
//   createdBy: string;
//   originalUrl: string;
//   channelId: string;
//   channelTitle: string;
//   thumbnailUrl: string;
//   videoCount: number;
// };

export type TypesenseMoment = {
  id: string;
  content: string;
  start: number;
  videoId: string;
  youtubeVideoId: string;
  videoTitle: string;
  thumbnailUrl: string;
};

export type DB = PostgresJsDatabase;

export type Collection = InferSelectModel<typeof TB_collections>;
