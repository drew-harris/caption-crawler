import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    YOUTUBE_API_KEY: z.string(),
  },

  runtimeEnvStrict: {
    DATABASE_URL: import.meta.env.VITE_DATABASE_URL,
    YOUTUBE_API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY,
  },

  emptyStringAsUndefined: true,
});
