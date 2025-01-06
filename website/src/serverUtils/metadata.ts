import { TB_metadata } from "db";
import { InferSelectModel, eq } from "drizzle-orm";
import { getPlaylistDisplayInfo } from "shared/yt";
import type { DB } from "shared/types";
import { z } from "zod";
import { youtube_v3 } from "@googleapis/youtube";

export type Metadata = InferSelectModel<typeof TB_metadata>;

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

  const thumbnail =
    youtubeInfo.thumbnails?.maxres?.url ||
    youtubeInfo.thumbnails?.high?.url ||
    youtubeInfo.thumbnails?.medium?.url ||
    youtubeInfo.thumbnails?.default?.url;

  const candidateData = {
    channelId: youtubeInfo.channelId,
    channelTitle: youtubeInfo.channelTitle,
    description: youtubeInfo.description,
    id: playlistId,
    thumbnailUrl: thumbnail,
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

export const getChannelMetadata = async ({
  db,
  channelHandle,
  youtubeKey,
}: {
  channelHandle: string;
  youtubeKey: string;
  db: DB;
}): Promise<Metadata> => {
  // First check if we already have this channel's metadata
  const [possibleMetadata] = await db
    .select()
    .from(TB_metadata)
    .where(eq(TB_metadata.channelId, channelHandle));

  if (possibleMetadata) {
    return possibleMetadata;
  }

  const channelInfo = await getChannelDisplayInfo(youtubeKey, channelHandle);

  const thumbnail =
    channelInfo.thumbnails?.maxres?.url ||
    channelInfo.thumbnails?.high?.url ||
    channelInfo.thumbnails?.medium?.url ||
    channelInfo.thumbnails?.default?.url;

  const candidateData = {
    channelId: channelHandle,
    channelTitle: channelInfo.title,
    description: channelInfo.description,
    id: channelHandle, // Using handle as ID since we don't have a playlist ID
    thumbnailUrl: thumbnail,
    title: channelInfo.title, // Using channel title since we don't have a playlist title
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

  if (!inserted) {
    throw new Error("Could not insert metadata");
  }

  return inserted;
};

export const getChannelDisplayInfo = async (
  youtubeKey: string,
  channelHandle: string,
) => {
  // First we need to get the channel ID from the handle
  const handleParams = new URLSearchParams({
    part: "snippet",
    key: youtubeKey,
    forHandle: channelHandle,
  });

  const handleResponse = await fetch(
    "https://youtube.googleapis.com/youtube/v3/channels?" +
      handleParams.toString(),
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!handleResponse.ok) {
    throw new Error("Got bad response from youtube api when fetching channel");
  }

  const data =
    (await handleResponse.json()) as youtube_v3.Schema$ChannelListResponse;

  const channel = data.items?.at(0)?.snippet;

  if (!channel) {
    throw new Error("Could not get channel info");
  }

  return channel;
};
