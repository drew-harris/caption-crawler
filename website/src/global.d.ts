import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { createAuth } from "./auth";
import type { Client as TSClient } from "typesense";
import { Queue } from "bullmq";
import { PossibleJob } from "shared/types";
import { Redis } from "ioredis";

type User = {
  id: string;
  isGoogle: boolean;
  isPro: boolean;
  isAdmin: boolean;
  createdAt: Date;
};

declare module "hono" {
  interface Env {
    Variables: {
      db: PostgresJsDatabase;
      auth: ReturnType<typeof createAuth>;
      user?: User;
      queue: Queue<PossibleJob>;
      typesense: TSClient;
      redis: Redis;
    };
  }
}
