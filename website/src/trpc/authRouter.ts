import { publicProcedure, router } from "~/trpc/base";

export const authRouter = router({
  whoAmI: publicProcedure.query(({ ctx }) => {
    return {
      user: ctx.user || null,
    };
  }),
});
