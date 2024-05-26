import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { createAuth } from "./auth";
import { Queue } from "bullmq";
import { PossibleJob } from "shared/types";

type User = {
  id: string;
  isGoogle: boolean;
  isPro: boolean;
  createdAt: Date;
};

declare module "hono" {
  interface Env {
    Variables: {
      db: PostgresJsDatabase;
      auth: ReturnType<typeof createAuth>;
      user?: User;
      queue: Queue<PossibleJob>;
    };
  }
}
