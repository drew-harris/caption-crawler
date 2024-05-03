import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    YOUTUBE_API_KEY: z.string(),
    REDIS_PASSWORD: z.string(),
    REDIS_HOST: z.string(),
  },

  runtimeEnvStrict: {
    DATABASE_URL: process.env.DATABASE_URL,
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST,
  },

  emptyStringAsUndefined: true,
});
