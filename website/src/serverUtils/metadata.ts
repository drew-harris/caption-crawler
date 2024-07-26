import { TB_metadata } from "db";
import { InferSelectModel, eq } from "drizzle-orm";
import { getPlaylistDisplayInfo } from "shared/yt";
import type { DB } from "shared/types";
import { z } from "zod";

type Metadata = InferSelectModel<typeof TB_metadata>;

const metadataSchema = z.object({
  channelId: z.string(),
  channelTitle: z.string(),
  description: z.string().nullable(),
  id: z.string(),
  thumbnailUrl: z.string(),
  title: z.string(),
}) satisfies z.ZodType<Metadata>;

export const getPlaylistMetadata = async ({
  db,
  playlistId,
  youtubeKey,
}: {
  playlistId: string;
  youtubeKey: string;
  db: DB;
}): Promise<Metadata> => {
  const [possibleMetadata] = await db
    .select()
    .from(TB_metadata)
    .where(eq(TB_metadata.id, playlistId));

  if (possibleMetadata) {
    return possibleMetadata;
  }

  const youtubeInfo = await getPlaylistDisplayInfo(youtubeKey, playlistId);

  // Use zod

  const candidateData = {
    channelId: youtubeInfo.channelId,
    channelTitle: youtubeInfo.channelTitle,
    description: youtubeInfo.description,
    id: playlistId,
    thumbnailUrl: youtubeInfo.thumbnails?.default?.url,
    title: youtubeInfo.title,
  };

  const parseResult = metadataSchema.safeParse(candidateData);
  if (parseResult.error) {
    throw new Error("Could not parse metadata");
  }
  const metadata = parseResult.data;

  const [inserted] = await db
    .insert(TB_metadata)
    .values([metadata])
    .returning();
  // Insert into database and return
  if (!inserted) {
    throw new Error("Could not insert metadata");
  }
  return inserted;
};
