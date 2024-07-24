import { TB_collections } from "db";
import { adminProcedure, router } from "~/trpc/base";

export const adminRouter = router({
  getCollections: adminProcedure.query(async ({ ctx }) => {
    const collections = await ctx.typesense.collections().retrieve();
    return collections;
  }),

  nukeAllPlaylists: adminProcedure.mutation(async ({ ctx }) => {
    const collections = await ctx.typesense.collections().retrieve();
    for (const collection of collections) {
      await ctx.typesense.collections(collection.name).delete();
    }
    await ctx.db.delete(TB_collections);
  }),
});
