import { Job } from "bullmq";
import { TB_videos } from "db";
import { PlaylistIngestJob } from "shared/types";
import { Deps } from ".";
import { getVideosFromYoutube } from "./captions";
import { getVideoIdsForCollection } from "./createOrGetPlaylist";
import { createIndexIfNotExist } from "./searching";
import { HandleVideoInput, handleVideo } from "./videos";
import { createId } from "shared";

export const handlePlaylistIngest = async (
  job: Job<PlaylistIngestJob>,
  deps: Deps,
) => {
  console.log(job.data);

  const currentVideoIds = await getVideoIdsForCollection(job, deps);

  // Create an index on typesense if it doesn't exist already
  const searchIndex = await createIndexIfNotExist(
    job.data.collection.id,
    deps.typesense,
  );

  let youtubeVideos = await getVideosFromYoutube(job.data.collection.youtubeId);

  youtubeVideos = youtubeVideos.filter((v) => {
    if (v.snippet?.thumbnails?.medium?.url) {
      return true;
    } else {
      return false;
    }
  });

  const videos = youtubeVideos.filter(
    (v) => !currentVideoIds.includes(v.contentDetails?.videoId || ""),
  );

  const videoInputs = videos.map(
    (v) =>
      ({
        id: createId("video"),
        youtubeData: v,
        collectionId: job.data.collection.id,
      }) satisfies HandleVideoInput,
  );

  // Add videos to database
  const handleVideoResults = await Promise.all(
    videoInputs.map((v) => handleVideo(v, deps)),
  );

  const inserts = [];
  for (const result of handleVideoResults) {
    if (result.result === "success") {
      inserts.push(result.insert);
    } else {
      console.error("Error adding video", result.error);
    }
  }

  const inserted = await deps.db.insert(TB_videos).values(inserts).returning();

  console.log("INSERTED", inserted.length, "Videos");
  console.log(
    "Failed to insert",
    handleVideoResults.filter((r) => r.result === "error").length,
  );

  return "Done";
};
