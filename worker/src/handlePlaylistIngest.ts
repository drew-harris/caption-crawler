import { Job } from "bullmq";
import { TB_collections, TB_videos } from "db";
import { PlaylistIngestJob } from "shared/types";
import { Deps } from ".";
import { getVideosFromYoutube } from "./captions";
import { getVideoIdsForCollection } from "./getVideoIdsFromCollection";
import { createIndexIfNotExist } from "./searching";
import { HandleVideoInput, handleVideo } from "./videos";
import { createId } from "shared";
import { logger } from "./logging";
import { eq } from "drizzle-orm";

export const handlePlaylistIngest = async (
  job: Job<PlaylistIngestJob>,
  deps: Deps,
) => {
  const currentVideoIds = await getVideoIdsForCollection(job, deps);

  logger.info({ collection: job.data }, "Handling ingest job");

  // Create an index on typesense if it doesn't exist already
  const searchIndex = await createIndexIfNotExist(
    job.data.collection.id,
    deps.typesense,
  );

  let youtubeVideos = await getVideosFromYoutube(job.data.collection.youtubeId);

  logger.info({ amount: youtubeVideos.length }, "Got videos from youtube");

  // Update the video count
  await deps.db
    .update(TB_collections)
    .set({
      videoCount: youtubeVideos.length,
    })
    .where(eq(TB_collections.id, job.data.collection.id));

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

  logger.info({ amount: videoInputs.length }, "Got videos to handle");

  // Add videos to database
  const handleVideoResults = await Promise.all(
    videoInputs.map((v) => handleVideo(v, deps)),
  );

  const inserts = [];
  for (const result of handleVideoResults) {
    if (result.result === "success") {
      inserts.push(result.insert);
    } else {
      logger.error(result.error, "error adding video");
    }
  }

  const inserted = await deps.db.insert(TB_videos).values(inserts).returning();

  logger.info({ amount: inserted.length }, "Inserted videos");

  // Update the final video count to reflect actual inserted videos
  await deps.db
    .update(TB_collections)
    .set({
      videoCount: currentVideoIds.length + inserted.length,
    })
    .where(eq(TB_collections.id, job.data.collection.id));

  // Delete the redis key
  await deps.redis.del(`jobwith:${job.data.collection.id}`);
  await deps.redis.del(`processing:${job.data.collection.id}`);

  logger.info(
    { amount: handleVideoResults.filter((r) => r.result === "error").length },
    "Errors processing videos videos",
  );

  return "Done";
};
