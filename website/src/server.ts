import { serve } from "@hono/node-server";
import Redis from "ioredis";
import { trpcServer } from "@hono/trpc-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { appRouter } from "./trpc/app";
import { handlePage } from "./internal/serverPageHandler";
import { Queue } from "bullmq";
import postgres from "postgres";
import { Hono } from "hono";
import { PossibleJob } from "shared/types";
import { drizzle } from "drizzle-orm/postgres-js";
import { TB_users } from "db";
import { eq } from "drizzle-orm";
import { createAuth } from "./auth";
import { env } from "./env";
import { authMiddleware } from "./auth/middleware";
import { Client as TSClient } from "typesense";
import { TRPCContext } from "./trpc/base";
import { eiRoutes } from "~/eisearch";
import { logger } from "~/logging";
import Stripe from "stripe";

const server = new Hono();

const queryClient = postgres(env.DATABASE_URL);
const db = drizzle(queryClient);
const auth = createAuth(db);
const ingestQueue = new Queue<PossibleJob>(env.QUEUE_NAME, {
  connection: {
    host: env.REDIS_HOST,
    password: env.REDIS_PASSWORD,
    port: 6379,
  },
  prefix: "cc",
});

const typesense = new TSClient({
  nodes: [
    {
      host: env.TYPESENSE_HOST,
      port: 8108,
      protocol: "http",
    },
  ],
  apiKey: env.TYPESENSE_API_KEY,
});

const redis = new Redis({
  host: env.REDIS_HOST,
  password: env.REDIS_PASSWORD,
  port: 6379,
  keyPrefix: "cc-data",
});

server.use("/assets/*", serveStatic({ root: "./dist/public" }));
server.use("/favicon.ico", serveStatic({ path: "./dist/public/favicon.ico" }));

server.use("*", async (c, next) => {
  c.set("db", db);
  c.set("auth", auth);
  c.set("queue", ingestQueue);
  c.set("typesense", typesense);
  c.set("redis", redis);
  await next();
});

server.use("*", authMiddleware);

server.route("/ei", eiRoutes);

server.post("/api/webhook", async (c) => {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  const sig = c.req.header("stripe-signature");
  const body = await c.req.text();
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig!,
      env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (userId) {
        await c.var.db
          .update(TB_users)
          .set({ 
            isPro: true,
            playlistLimit: 100
          })
          .where(eq(TB_users.id, userId));
      }
    }

    return c.json({ received: true });
  } catch (err) {
    logger.error(err, "Error processing Stripe webhook");
    return c.json({ error: (err as Error).message }, 400);
  }
});

server.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext(_opts, c) {
      return {
        db,
        auth,
        queue: ingestQueue,
        user: c.var["user"],
        baseRequest: c,
        typesense,
        redis,
      } satisfies TRPCContext;
    },
    onError({ error }) {
      logger.error(error);
    },
  }),
);

// Free to use this hono server for whatever you want (redirect urls, etc)

server.get("*", handlePage);

if (import.meta.env.PROD) {
  const port = Number(process.env["PORT"] || 3000);
  serve(
    {
      port,
      fetch: server.fetch,
    },
    () => {
      logger.info(`🚀 Server running at http://localhost:${port}`);
    },
  );
}

export default server;
