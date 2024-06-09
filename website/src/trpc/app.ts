import { authRouter } from "~/trpc/authRouter";
import { router } from "./base";
import { playlistQueueRouter } from "./playlistQueue";
import { adminRouter } from "~/trpc/adminRouter";

export const appRouter = router({
  playlistQueue: playlistQueueRouter,
  users: authRouter,
  admin: adminRouter,
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
