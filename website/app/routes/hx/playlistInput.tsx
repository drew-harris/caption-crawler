import { createRoute } from "honox/factory";
import { z } from "zod";
import { hxRender } from "../../middleware/hxRender";
import { hxValidate } from "../../validate";
import { ErrorMsg } from "../../components/ErrorMsg";
import { getPlaylistDisplayInfo, getPlaylistIdFromUrl } from "shared/yt";
import { env } from "../../env";
import { JobType, PlaylistIngestJob } from "shared/types";
import { ensureUser } from "../../middleware/ensureUser";
import { createId } from "shared";

const inputSchema = z.object({
  url: z.string().url(),
});

// Main initial playlist ingest point
export const POST = createRoute(
  hxRender,
  ensureUser,
  hxValidate("form", inputSchema),
  async (c) => {
    try {
      const { url } = c.req.valid("form");
      const playlistId = getPlaylistIdFromUrl(url);
      const playlistInfo = await getPlaylistDisplayInfo(
        env.YOUTUBE_API_KEY,
        playlistId,
      );

      await c.var.queue.add(createId("jobs"), {
        type: JobType.PLAYLIST_INGEST,
        playlistId: playlistId,
        createdBy: c.var.user.id,
        originalUrl: url,
      } satisfies PlaylistIngestJob);

      return c.render(
        <div>{playlistInfo.description || playlistInfo.title}</div>,
      );
    } catch (e) {
      console.log(e);
      return c.render(
        <ErrorMsg>There was an error processing your playlist</ErrorMsg>,
      );
    }
  },
);
