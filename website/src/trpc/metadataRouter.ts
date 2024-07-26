import { getPlaylistDisplayInfo, getPlaylistIdFromUrl } from "shared/yt";
import { z } from "zod";
import { env } from "~/env";
import { getPlaylistMetadata } from "~/serverUtils/metadata";
import { publicProcedure, router } from "~/trpc/base";

export const metadataRouter = router({
  getMetadata: publicProcedure
    .input(
      z.object({
        url: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const playlistId = getPlaylistIdFromUrl(input.url);
      const metadata = await getPlaylistMetadata({
        db: ctx.db,
        playlistId,
        youtubeKey: env.YOUTUBE_API_KEY,
      });
      return metadata;
    }),
});
