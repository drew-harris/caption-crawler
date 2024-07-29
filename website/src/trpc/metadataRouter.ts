import { TRPCError } from "@trpc/server";
import { TB_collections, TB_metadata } from "db";
import { eq, getTableColumns } from "drizzle-orm";
import { getPlaylistDisplayInfo, getPlaylistIdFromUrl } from "shared/yt";
import { z } from "zod";
import { env } from "~/env";
import { getPlaylistMetadata } from "~/serverUtils/metadata";
import { publicProcedure, router } from "~/trpc/base";

export const metadataRouter = router({
  getMetadataFromUrl: publicProcedure
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

  // Should be rarely used due to caching stchuff
  getMetadataFromCollection: publicProcedure
    .input(
      z.object({
        collectionId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const [metadata] = await ctx.db
        .select({
          ...getTableColumns(TB_metadata),
        })
        .from(TB_collections)
        .where(eq(TB_collections.id, input.collectionId))
        .leftJoin(TB_metadata, eq(TB_collections.youtubeId, TB_metadata.id));
      if (!metadata) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Collection not found",
        });
      }
      return metadata;
    }),
});
