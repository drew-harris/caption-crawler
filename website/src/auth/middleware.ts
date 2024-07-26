import { Context, Env, Next } from "hono";
import { createNewUser } from "../serverUtils/users";
import { getCookie, setCookie } from "hono/cookie";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { Lucia } from "lucia";
import { logger } from "~/logging";

export const authMiddleware = async (c: Context<Env>, next: Next) => {
  const cookie = getCookie(c, c.var.auth.sessionCookieName);
  if (cookie) {
    const parsed = c.var.auth.readSessionCookie(cookie);
    if (parsed) {
      const session = await c.var.auth.validateSession(parsed);
      if (session.session) {
        c.set("user", session.user);
      }
    }
  }
  await next();
};

export const createUserWithCookie = async (
  db: PostgresJsDatabase,
  auth: Lucia,
  req: Context<Env>,
) => {
  logger.info("Creating user with cookie");
  const user = await createNewUser(db);
  const session = await auth.createSession(user.id, {});
  const sessionCookie = auth.createSessionCookie(session.id);

  setCookie(req, auth.sessionCookieName, sessionCookie.serialize());
  return user;
};
