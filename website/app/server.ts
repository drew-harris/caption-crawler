import { showRoutes } from "hono/dev";
import { Env, Hono } from "hono";
import { createApp } from "honox/server";
import { createDb } from "./db";
import { createAuth } from "./auth";
import { getCookie, setCookie } from "hono/cookie";
import { createId } from "./ids";
import { userTable } from "db";
import { createNewUser } from "./db/users";

const baseApp = new Hono<Env>();

baseApp.use("*", async (c, next) => {
  const db = createDb(c.env.db);
  const auth = createAuth(db);
  c.set("db", db);
  c.set("auth", auth);
  await next();
});

// If no session, create

// Main auth middleware
baseApp.use("*", async (c, next) => {
  const cookie = getCookie(c, c.var.auth.sessionCookieName);
  if (!cookie) {
    console.log("New User With No Cookie!");
    // Create new user and set cookie
    const user = await createNewUser(c.var.db);
    const session = await c.var.auth.createSession(user.id, {});
    const sessionCookie = c.var.auth.createSessionCookie(session.id);

    setCookie(c, c.var.auth.sessionCookieName, sessionCookie.serialize());
    c.set("user", user);
  } else {
    const parsed = c.var.auth.readSessionCookie(cookie);
    if (!parsed) {
      throw new Error("Invalid session cookie");
    }
    const session = await c.var.auth.validateSession(parsed);
    if (session.session) {
      c.set("user", session.user);
    } else {
      // Create new user and set cookie
      // TODO: Cleanup
      const user = await createNewUser(c.var.db);
      const session = await c.var.auth.createSession(user.id, {});
      const sessionCookie = c.var.auth.createSessionCookie(session.id);

      setCookie(c, c.var.auth.sessionCookieName, sessionCookie.serialize());
      c.set("user", user);
    }
  }

  await next();
});

const app = createApp<Env>({
  app: baseApp,
});

showRoutes(app);

export default app;
