import { Job, Worker } from "bullmq";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { JobType, PlaylistIngestJob, PossibleJob } from "shared/types";
import { Client as TSClient } from "typesense";
import { env } from "./env";

import { handlePlaylistIngest } from "./handlePlaylistIngest";

// Check if database is working

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const db = drizzle(pool, {
  logger: true,
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
};

export type Deps = typeof deps;

const playlistIngestWorker = new Worker<PossibleJob>(
  env.QUEUE_NAME,
  async (job) => {
    console.log("GOT JOB", job.data);
    try {
      switch (job.data.type) {
        case JobType.PLAYLIST_INGEST:
          console.log("Handling playlist ingest");
          return handlePlaylistIngest(job as Job<PlaylistIngestJob>, deps);
        default:
          throw new Error("Invalid job type");
      }
    } catch (err) {
      console.error(err);
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
  console.log("SIGTERM received, stopping worker");
  await playlistIngestWorker.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, stopping worker");
  await playlistIngestWorker.close();
  process.exit(0);
});
