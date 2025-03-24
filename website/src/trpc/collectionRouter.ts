import { TB_collections, TB_metadata, TB_Ownership } from "db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure, router, autoUserProcedure } from "~/trpc/base";

export const collectionRouter = router({
  getAllCollections: autoUserProcedure.query(async ({ ctx }) => {
    const collections = await ctx.db
      .select({
        id: TB_collections.id,
        type: TB_collections.type,
        semantic: TB_collections.semantic,
        createdAt: TB_collections.createdAt,
        videoCount: TB_collections.videoCount,
        metadata: {
          id: TB_metadata.id,
          title: TB_metadata.title,
          description: TB_metadata.description,
          thumbnailUrl: TB_metadata.thumbnailUrl,
          channelId: TB_metadata.channelId,
          channelTitle: TB_metadata.channelTitle,
        },
      })
      .from(TB_Ownership)
      .innerJoin(
        TB_collections,
        eq(TB_Ownership.collectionId, TB_collections.id),
      )
      .innerJoin(TB_metadata, eq(TB_collections.youtubeId, TB_metadata.id))
      .where(eq(TB_Ownership.userId, ctx.user.id));
    return collections;
  }),
  getCollection: publicProcedure
    .input(
      z.object({
        collectionId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const [collection] = await ctx.db
        .select()
        .from(TB_collections)
        .where(eq(TB_collections.id, input.collectionId));
      if (!collection) {
        throw new Error("Collection not found");
      }
      return collection;
    }),
});
