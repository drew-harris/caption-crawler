import { TB_videos } from "db";
import { Deps } from ".";
import { collapseWords, getWordsFromVideoId } from "./captions";
import { createId } from "shared";

interface VideoInput {
  id: string;
  title: string;
  userId: string;
  playlistId: string;
}

type VideoInsert = typeof TB_videos.$inferInsert;

export function getVideoInsert(video: VideoInput): VideoInsert {
  // Ensure that all required fields are present
  if (!video.id || !video.title || !video.userId || !video.playlistId) {
    throw new Error("Missing required video fields");
  }

  // Insert the video into the database
  const insert: VideoInsert = {
    id: video.id,
    title: video.title,
    userId: video.userId,
    playlistId: video.playlistId,
  };
  return insert;
}

export async function addVideoToTypesense(video: VideoInput, deps: Deps) {
  // Get the words from the video id
  const words = await getWordsFromVideoId(video.id);
  const collapsedWords = collapseWords(words, 8);

  await deps.typesense
    .collections(video.playlistId)
    .documents()
    .import(
      collapsedWords.map((words) => ({
        id: createId("content"),
        content: words.words,
        start: Math.round(Math.round(words.start) / 1000),
        playlistId: video.playlistId,
        videoId: video.id,
      })),
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
  video: VideoInput,
  deps: Deps,
): Promise<HandleVideoResult> => {
  try {
    // First, attempt to add the video to Typesense
    await addVideoToTypesense(video, deps);

    // If successful, proceed to add the video to the database
    const insert = getVideoInsert(video);

    // If both operations are successful, return a success result
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
