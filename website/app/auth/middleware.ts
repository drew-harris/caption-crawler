import { Context, Env, Next } from "hono";
import { createNewUser } from "../db/users";
import { getCookie, setCookie } from "hono/cookie";

export const authMiddleware = async (c: Context<Env>, next: Next) => {
  const cookie = getCookie(c, c.var.auth.sessionCookieName);
  if (!cookie) {
    return createUserAndContinue(c, next);
  } else {
    const parsed = c.var.auth.readSessionCookie(cookie);
    if (!parsed) {
      return createUserAndContinue(c, next);
    }
    const session = await c.var.auth.validateSession(parsed);
    if (session.session) {
      c.set("user", session.user);
    } else {
      return createUserAndContinue(c, next);
    }
  }
  await next();
};

const createUserAndContinue = async (c: Context<Env>, next: Next) => {
  const user = await createNewUser(c.var.db);
  const session = await c.var.auth.createSession(user.id, {});
  const sessionCookie = c.var.auth.createSessionCookie(session.id);

  setCookie(c, c.var.auth.sessionCookieName, sessionCookie.serialize());
  c.set("user", user);

  await next();
  return;
};
