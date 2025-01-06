import { youtube_v3 } from "@googleapis/youtube";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export const getPlaylistIdFromUrl = (url: string) => {
  const playlistUrl = new URLSearchParams(url.split("?")[1]);
  const playlistId = playlistUrl.get("list");
  if (!playlistId) {
    return null;
  }
  return playlistId;
};

export const getChannelHandleFromUrl = (url: string): string | null => {
  try {
    // Remove trailing slashes and any additional path segments
    const cleanUrl = url.split("/")[3];

    // Check if the URL contains a channel handle (starts with @)
    if (cleanUrl && cleanUrl.startsWith("@")) {
      // Return the handle including the @ symbol
      return cleanUrl;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const getPlaylistDisplayInfo = async (
  youtubeKey: string,
  playlistId: string,
) => {
  const params = new URLSearchParams({
    part: "snippet,contentDetails",
    key: youtubeKey,
    maxResults: "1",
    id: playlistId,
  });

  const response = await fetch(
    "https://youtube.googleapis.com/youtube/v3/playlists?" + params.toString(),
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Got bad response from youtube api");
  }

  const data =
    (await response.json()) as youtube_v3.Schema$PlaylistListResponse;

  const playlist = data.items?.at(0)?.snippet;
  if (!playlist) {
    throw new Error("Could not get playlist info");
  }

  return playlist;
};
