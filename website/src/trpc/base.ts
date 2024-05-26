import { initTRPC } from "@trpc/server";
import { Context, Env } from "hono";
import { User } from "lucia";
import { createUserWithCookie } from "../auth/middleware";
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */

export type TRPCContext = Env["Variables"] & {
  baseRequest: Context<Env>;
};

const t = initTRPC.context<TRPCContext>().create();
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;

export const autoUserProcedure = t.procedure.use(async ({ next, ctx }) => {
  let user: User | null = null;
  if (!ctx.user) {
    user = await createUserWithCookie(ctx.db, ctx.auth, ctx.baseRequest);
  } else {
    user = ctx.user;
  }

  await next();
  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});
