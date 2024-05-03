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
};

export type FakeJob = BaseJob & {
  color: string;
  type: JobType.FAKE_MESSAGE;
};

export type PossibleJob = PlaylistIngestJob | FakeJob;
