import { adminProcedure, router } from "~/trpc/base";

export const adminRouter = router({
  getCollections: adminProcedure.query(async ({ ctx }) => {
    const collections = await ctx.typesense.collections().retrieve();
    return collections;
  }),
});
