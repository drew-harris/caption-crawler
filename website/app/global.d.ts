import "typed-htmx";

import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { createAuth } from "./auth";
import { Queue } from "bullmq";
import { PossibleJob } from "shared/types";

type Head = {
  title?: string;
};

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
      user: User;
      queue: Queue<PossibleJob>;
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
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  isGoogle: boolean;
  createdAt: Date;
  isPro: boolean;
}

declare global {
  namespace Hono {
    interface HTMLAttributes extends HtmxAttributes {}
  }
}
