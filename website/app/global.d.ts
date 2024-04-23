import { DrizzleD1Database } from "drizzle-orm/d1";
import { createAuth } from "./auth";

type Head = {
  title?: string;
};

declare module "hono" {
  interface Env {
    Bindings: {
      kv: KVNamespace;
      ELASTIC_NODE: string;
      ELASTIC_PASSWORD: string;
      db: D1Database;
      worker: Fetcher;
      playlistQueue: Queue;
    };
    Variables: {
      db: DrizzleD1Database;
      auth: ReturnType<typeof createAuth>;
    };
  }

  interface ContextRenderer {
    (
      content: string | Promise<string>,
      head?: Head,
    ): Response | Promise<Response>;
  }
}

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof createAuth>;
  }
}
