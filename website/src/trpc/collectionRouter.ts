import { TB_collections } from "db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure, router } from "~/trpc/base";

export const collectionRouter = router({
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
