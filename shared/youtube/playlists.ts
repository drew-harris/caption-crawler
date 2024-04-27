export const getPlaylistIdFromUrl = (url: string) => {
  const playlistUrl = new URLSearchParams(url.split("?")[1]);
  const playlistId = playlistUrl.get("list");
  if (!playlistId) {
    throw new Error("Could not get playlist id from url");
  }
  return playlistId;
};
