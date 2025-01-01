import { Job, RedisConnection, Worker } from "bullmq";
import "dotenv/config";
import Redis from "ioredis";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { JobType, PlaylistIngestJob, PossibleJob } from "shared/types";
import { Client as TSClient } from "typesense";
import { env } from "./env";

import { handlePlaylistIngest } from "./handlePlaylistIngest";
import { logger } from "./logging";

// Check if database is working

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const db = drizzle(pool, {
  logger: false,
});

const redis = new Redis({
  host: env.REDIS_HOST,
  password: env.REDIS_PASSWORD,
  port: 6379,
  keyPrefix: "cc-data",
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

const deps = {
  db,
  typesense,
  redis,
};

export type Deps = typeof deps;

const playlistIngestWorker = new Worker<PossibleJob>(
  env.QUEUE_NAME,
  async (job) => {
    logger.info({ job: job.data }, "Got job");
    try {
      switch (job.data.type) {
        case JobType.PLAYLIST_INGEST:
          logger.info("Handling playlist ingest");
          return handlePlaylistIngest(job as Job<PlaylistIngestJob>, deps);
        default:
          throw new Error("Invalid job type");
      }
    } catch (err) {
      logger.error(err);
      throw err;
    }
  },
  {
    prefix: "cc",
    connection: {
      host: env.REDIS_HOST,
      password: env.REDIS_PASSWORD,
      port: 6379,
    },
    autorun: false,
  },
);

playlistIngestWorker.run();

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, stopping worker");
  await playlistIngestWorker.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, stopping worker");
  await playlistIngestWorker.close();
  process.exit(0);
});
