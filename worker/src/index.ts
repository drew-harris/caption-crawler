import "dotenv/config";
import { Worker } from "bullmq";
import { PossibleJob } from "shared/types";
import { env } from "./env";

const playlistIngestWorker = new Worker<PossibleJob>(
  "ingestQueue",
  async (job) => {
    console.log(job.data);
    console.log(job.timestamp);
    return {
      done: true,
    };
  },
  {
    connection: {
      host: env.REDIS_HOST,
      password: env.REDIS_PASSWORD,
      port: 6379,
    },
  },
);
