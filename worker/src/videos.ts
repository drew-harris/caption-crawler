import { TB_videos } from "db";
import { Deps } from ".";
import { collapseWords, getWordsFromVideoId } from "./captions";
import { createId } from "shared";
import { TypesenseMoment } from "shared/types";
import { z } from "zod";
import { youtube_v3 } from "@googleapis/youtube";

export interface HandleVideoInput {
  id: string;
  collectionId: string;
  youtubeData: youtube_v3.Schema$PlaylistItem;
}

type VideoInsert = typeof TB_videos.$inferInsert;

const videoSchema = z.object({
  id: z.string(),
  collectionId: z.string(),
  youtubeId: z.string(),
  thumbnailUrl: z.string(),
  title: z.string(),
}) satisfies z.ZodType<VideoInsert>;

export function getVideoInsert(video: HandleVideoInput): VideoInsert {
  const toParse = {
    collectionId: video.collectionId,
    id: video.id,
    thumbnailUrl: video.youtubeData.snippet?.thumbnails?.medium?.url,
    title: video.youtubeData.snippet?.title,
    youtubeId: video.youtubeData.contentDetails?.videoId,
  };

  const parsed = videoSchema.safeParse(toParse);
  if (parsed.error) {
    throw new Error("Could not parse video");
  } else {
    return parsed.data;
  }
}

export async function addVideoToTypesense(
  videoInsert: VideoInsert,
  deps: Deps,
) {
  // Get the words from the video id
  const words = await getWordsFromVideoId(videoInsert.youtubeId);
  const collapsedWords = collapseWords(words, 4);

  await deps.typesense
    .collections(videoInsert.collectionId)
    .documents()
    .import(
      collapsedWords.map(
        (words) =>
          ({
            id: createId("content"),
            content: words.words,
            start: Math.round(Math.round(words.start) / 1000),
            videoId: videoInsert.id,
            youtubeVideoId: videoInsert.youtubeId,
            thumbnailUrl: videoInsert.thumbnailUrl,
            videoTitle: videoInsert.title,
          }) satisfies TypesenseMoment,
      ),
    );
}

type HandleVideoResult =
  | {
      result: "success";
      insert: VideoInsert;
    }
  | {
      result: "error";
      message: string;
      error: Error;
    };

export const handleVideo = async (
  video: HandleVideoInput,
  deps: Deps,
): Promise<HandleVideoResult> => {
  try {
    // If successful, proceed to add the video to the database
    const insert = getVideoInsert(video);

    // First, attempt to add the video to Typesense
    await addVideoToTypesense(insert, deps);

    return { result: "success", insert };
  } catch (error: any) {
    // If any operation fails, catch the error and return an error result
    return {
      result: "error",
      message: "Failed to handle video",
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};
