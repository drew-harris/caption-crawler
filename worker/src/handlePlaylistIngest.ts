import { PlaylistIngestMessage } from "shared/types";

export const handlePlaylistIngest = async (
  message: Message<unknown>,
  data: PlaylistIngestMessage,
  env: Env,
) => {
  console.log("handling playlist ingest", data.playlistId);
  // Steps to ingest a playlist
  return message;
};
