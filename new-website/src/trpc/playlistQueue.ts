import { autoUserProcedure, publicProcedure, router } from "./base";

export const playlistQueueRouter = router({
  testAutoUser: autoUserProcedure.mutation(async ({ ctx, input }) => {
    return "done";
  }),

  whoAmI: publicProcedure.query(({ ctx }) => {
    return {
      user: ctx.user || null,
    };
  }),
});
