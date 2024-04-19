import { showRoutes } from "hono/dev";
import { createApp } from "honox/server";

const app = createApp();

// TODO: Fix type from generation
showRoutes(app as any);

export default app;
