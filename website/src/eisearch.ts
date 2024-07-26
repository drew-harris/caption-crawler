import { TB_collections } from "db";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { TypesenseMoment } from "shared/types";
import { SearchResponse } from "typesense/lib/Typesense/Documents";

const eiRoutes = new Hono();

eiRoutes.post("/search", async (c) => {
  const body = await c.req.json();

  const [playlist] = await c.var.db
    .select()
    .from(TB_collections)
    .where(eq(TB_collections.youtubeId, "PLy4hOlwN9C5FfB8djRUNS9VSrKvZIVwMC"));

  if (!playlist) {
    c.status(500);
    return c.json({ error: "Playlist not found" });
  }

  const result = (await c.var.typesense
    .collections(playlist.id)
    .documents()
    .search({
      q: body.query,
      query_by: "content",
      highlight_full_fields: "content",
      per_page: 30,
    })) as SearchResponse<TypesenseMoment>;
  const hits = result.hits?.map((hit) => {
    return {
      id: hit.document.id,
      content: hit?.highlight?.content?.value || hit.document.content,
      start: hit.document.start,
      videoId: hit.document.videoId,
      youtubeVideoId: hit.document.youtubeVideoId,
      thumbnailUrl: hit.document.thumbnailUrl,
      videoTitle: hit.document.videoTitle,
    } satisfies TypesenseMoment;
  });

  return c.json(hits);
});

export { eiRoutes };
