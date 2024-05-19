import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import "dotenv/config";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    YOUTUBE_API_KEY: z.string(),
    REDIS_PASSWORD: z.string(),
    REDIS_HOST: z.string(),
    QUEUE_NAME: z.string(),
  },

  runtimeEnv: process.env,

  emptyStringAsUndefined: true,
});
