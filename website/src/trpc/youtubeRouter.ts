import { getPlaylistDisplayInfo, getPlaylistIdFromUrl } from "shared/yt";
import { z } from "zod";
import { env } from "~/env";
import { autoUserProcedure, router } from "~/trpc/base";

export const youtubeRouter = router({
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
