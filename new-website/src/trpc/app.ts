import { publicProcedure, router } from "./base";
import { playlistQueueRouter } from "./playlistQueue";
import { todoRouter } from "./todos";

export const appRouter = router({
  todos: todoRouter,
  playlistQueue: playlistQueueRouter,
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
