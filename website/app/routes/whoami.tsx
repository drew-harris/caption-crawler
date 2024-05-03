import { createRoute } from "honox/factory";
import { createId } from "../ids";
import { JobType } from "shared/types";

export default createRoute(async (c) => {
  const jobs = await c.var.queue.add(createId("jobs"), {
    type: JobType.PLAYLIST_INGEST,
    playlistId: "sliejf",
  });
  return c.render(
    <div>
      <div>{c.var.user.id}</div>
      <div>{jobs.name}</div>
    </div>,
  );
});
