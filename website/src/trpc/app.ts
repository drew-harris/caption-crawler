import { authRouter } from "~/trpc/authRouter";
import { router } from "./base";
import { playlistQueueRouter } from "./playlistQueueRouter";
import { adminRouter } from "~/trpc/adminRouter";
import { youtubeRouter } from "~/trpc/youtubeRouter";
import { metadataRouter } from "~/trpc/metadataRouter";
import { collectionRouter } from "~/trpc/collectionRouter";

export const appRouter = router({
  playlistQueue: playlistQueueRouter,
  collections: collectionRouter,
  metadata: metadataRouter,
  youtube: youtubeRouter,
  users: authRouter,
  admin: adminRouter,
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
