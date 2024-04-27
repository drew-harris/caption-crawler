export enum MessageType {
  PLAYLIST_INGEST = "playlistIngest",
  FAKE_MESSAGE = "fakeMessage",
}

type BaseMessage = {
  type: MessageType;
};

export type PlaylistIngestMessage = BaseMessage & {
  type: MessageType.PLAYLIST_INGEST;
  playlistId: string;
};

export type FakeMessage = BaseMessage & {
  color: string;
  type: MessageType.FAKE_MESSAGE;
};

export type PossibleMessage = PlaylistIngestMessage | FakeMessage;
