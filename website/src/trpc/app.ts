import { router } from "./base";
import { playlistQueueRouter } from "./playlistQueue";

export const appRouter = router({
  playlistQueue: playlistQueueRouter,
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
