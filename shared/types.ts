export enum JobType {
  PLAYLIST_INGEST = "playlistIngest",
  FAKE_MESSAGE = "fakeMessage",
}

type BaseJob = {
  type: JobType;
};

export type PlaylistIngestJob = BaseJob & {
  type: JobType.PLAYLIST_INGEST;
  playlistId: string;
  createdBy: string;
  originalUrl: string;
};

export type FakeJob = BaseJob & {
  color: string;
  type: JobType.FAKE_MESSAGE;
};

export type PossibleJob = PlaylistIngestJob | FakeJob;

export type CreatedPlaylist = {
  description: string | null;
  id: string;
  title: string;
  createdBy: string;
  originalUrl: string;
  channelId: string;
  channelTitle: string;
  thumbnailUrl: string;
  videoCount: number;
};
