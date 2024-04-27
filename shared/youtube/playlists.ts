import { youtube_v3 } from "@googleapis/youtube";

export const getPlaylistIdFromUrl = (url: string) => {
  const playlistUrl = new URLSearchParams(url.split("?")[1]);
  const playlistId = playlistUrl.get("list");
  if (!playlistId) {
    throw new Error("Could not get playlist id from url");
  }
  return playlistId;
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
    console.log(await response.text());
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
