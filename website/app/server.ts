import "dotenv/config";
import { showRoutes } from "hono/dev";
import { Env, Hono } from "hono";
import { createApp } from "honox/server";
import { authMiddleware } from "./auth/middleware";
import { env } from "./env";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { createAuth } from "./auth";
import { Queue } from "bullmq";
import { PossibleMessage } from "shared/types";

const baseApp = new Hono<Env>();
const queryClient = postgres(env.DATABASE_URL);
const db = drizzle(queryClient);
const auth = createAuth(db);

const ingestQueue = new Queue<PossibleMessage>("ingestQueue", {
  connection: {
    host: env.REDIS_HOST,
    password: env.REDIS_PASSWORD,
    port: 6379,
  },
});

baseApp.use("*", async (c, next) => {
  c.set("db", db);
  c.set("auth", auth);
  c.set("queue", ingestQueue);
  await next();
});

// Main auth middleware
baseApp.use("*", authMiddleware);

const app = createApp<Env>({
  app: baseApp,
});

showRoutes(app);

export default app;
