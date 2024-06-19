import { Hono } from "hono";
import { TypesenseMoment } from "shared/types";
import { SearchResponse } from "typesense/lib/Typesense/Documents";

const eiRoutes = new Hono();

eiRoutes.post("/search", async (c) => {
  const body = await c.req.json();
  const result = (await c.var.typesense
    .collections("PLy4hOlwN9C5FfB8djRUNS9VSrKvZIVwMC")
    .documents()
    .search({
      q: body.query,
      query_by: "content",
      highlight_full_fields: "content",
    })) as SearchResponse<TypesenseMoment>;
  const hits = result.hits?.map((hit) => {
    return {
      id: hit.document.id,
      playlistId: hit.document.playlistId,
      content: hit?.highlight?.content?.value,
      start: hit.document.start,
      videoId: hit.document.videoId,
      thumbnailUrl: hit.document.thumbnailUrl,
      videoTitle: hit.document.videoTitle,
    };
  });

  return c.json(hits);
});

export { eiRoutes };
