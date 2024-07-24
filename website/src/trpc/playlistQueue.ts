import { z } from "zod";
import { autoUserProcedure, publicProcedure, router } from "./base";
import { getPlaylistDisplayInfo, getPlaylistIdFromUrl } from "shared/yt";
import { env } from "../env";
import { createId } from "shared";
import { JobType, PlaylistIngestJob } from "shared/types";

export const playlistQueueRouter = router({
  testAutoUser: autoUserProcedure.mutation(async () => {
    return "done";
  }),

  whoAmI: publicProcedure.query(({ ctx }) => {
    return {
      user: ctx.user || null,
    };
  }),

  logOut: autoUserProcedure.mutation(async ({ ctx }) => {
    ctx.auth.invalidateUserSessions(ctx.user.id);
    return null;
  }),

  queuePlaylist: autoUserProcedure
    .input(z.object({ url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const playlistId = getPlaylistIdFromUrl(input.url);
      const playlistInfo = await getPlaylistDisplayInfo(
        env.YOUTUBE_API_KEY,
        playlistId,
      );

      console.log("Got playlist info", playlistInfo);
      const job = await ctx.queue.add(createId("jobs"), {
        type: JobType.PLAYLIST_INGEST,
        playlistId: playlistId,
        createdBy: ctx.user.id,
        originalUrl: input.url,
      } satisfies PlaylistIngestJob);

      return {
        job,
        playlistInfo,
      };
    }),
});
