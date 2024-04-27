import { showRoutes } from "hono/dev";
import { Env, Hono } from "hono";
import { createApp } from "honox/server";
import { createDb } from "./db";
import { createAuth } from "./auth";
import { getCookie, setCookie } from "hono/cookie";
import { createNewUser } from "./db/users";
import { authMiddleware } from "./auth/middleware";

const baseApp = new Hono<Env>();

baseApp.use("*", async (c, next) => {
  const db = createDb(c.env.db);
  const auth = createAuth(db);
  c.set("db", db);
  c.set("auth", auth);
  await next();
});

// Main auth middleware
baseApp.use("*", authMiddleware);

const app = createApp<Env>({
  app: baseApp,
});

showRoutes(app);

export default app;
