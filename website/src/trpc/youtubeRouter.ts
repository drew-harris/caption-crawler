import { getPlaylistDisplayInfo, getPlaylistIdFromUrl } from "shared/yt";
import { youtube_v3 } from "@googleapis/youtube";
import { z } from "zod";
import { env } from "~/env";
import { autoUserProcedure, router } from "~/trpc/base";
import { logger } from "~/logging";

export const youtubeRouter = router({
  searchPlaylists: autoUserProcedure
    .input(
      z.object({
        query: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const redis = ctx.redis;
      const cacheKey = `yt-search:${input.query}`;

      // Try to get from cache first
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached) as {
          id: string;
          title: string;
          channelTitle: string;
          thumbnailUrl: string;
        }[];
      }

      // If not in cache, fetch from YouTube API
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=playlist&q=${encodeURIComponent(
          input.query,
        )}&key=${env.YOUTUBE_API_KEY}&maxResults=5`,
      );

      if (!response.ok) {
        logger.error(await response.text());
        throw new Error("Failed to fetch search results");
      }

      const data =
        (await response.json()) as youtube_v3.Schema$SearchListResponse;

      logger.info(data);

      if (!data.items) {
        throw new Error("No items found in search response");
      }
      const results = data.items.map((item) => ({
        id: item?.id?.playlistId,
        title: item?.snippet?.title,
        channelTitle: item?.snippet?.channelTitle,
        thumbnailUrl: item?.snippet?.thumbnails?.default?.url,
      }));

      // Cache the results
      await redis.set(cacheKey, JSON.stringify(results));

      return results;
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
