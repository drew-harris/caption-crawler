import "dotenv/config";
import { showRoutes } from "hono/dev";
import { Env, Hono } from "hono";
import { createApp } from "honox/server";
import { authMiddleware } from "./auth/middleware";
import { env } from "./env";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { createAuth } from "./auth";

const baseApp = new Hono<Env>();
const queryClient = postgres(env.DATABASE_URL);
const db = drizzle(queryClient);
const auth = createAuth(db);

baseApp.use("*", async (c, next) => {
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
