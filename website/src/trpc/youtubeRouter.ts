import { getPlaylistDisplayInfo, getPlaylistIdFromUrl } from "shared/yt";
import { z } from "zod";
import { env } from "~/env";
import { autoUserProcedure, router } from "~/trpc/base";

export const youtubeRouter = router({
  searchPlaylists: autoUserProcedure
    .input(
      z.object({
        query: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=playlist&q=${encodeURIComponent(
          input.query,
        )}&key=${env.YOUTUBE_API_KEY}&maxResults=5`
      );
      const data = await response.json();
      return data.items.map((item: any) => ({
        id: item.id.playlistId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails.default.url,
      }));
    }),
  getPlaylistInfo: autoUserProcedure
    .input(
      z.object({
        playlistUrl: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const playlistId = getPlaylistIdFromUrl(input.playlistUrl);
      const info = await getPlaylistDisplayInfo(
        env.YOUTUBE_API_KEY,
        playlistId,
      );
      return info;
    }),
});
