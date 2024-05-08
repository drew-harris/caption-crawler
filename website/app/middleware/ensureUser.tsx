import { Context, Env, Next } from "hono";

export const ensureUser = async (c: Context<Env>, next: Next) => {
  if (!c.var?.user) {
    throw new Error("User not found");
  }
  await next();
};
