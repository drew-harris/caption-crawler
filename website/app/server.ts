import { showRoutes } from "hono/dev";
import { Env, Hono } from "hono";
import { createApp } from "honox/server";
import { createDb } from "./db";
import { createAuth } from "./auth";

const baseApp = new Hono<Env>();

baseApp.use("/", async (c, next) => {
  const db = createDb(c.env.db);
  const auth = createAuth(db);
  c.set("db", db);
  c.set("auth", auth);
  await next();
});

const app = createApp<Env>({
  app: baseApp,
});

showRoutes(app);

export default app;
