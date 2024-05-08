import { Job } from "bullmq";
import { TB_videos } from "db";
import { CreatedPlaylist, PlaylistIngestJob } from "shared/types";
import { Deps } from ".";
import { getVideosFromPlaylist } from "./captions";
import { createOrGetPlaylist } from "./createOrGetPlaylist";
import { createIndexIfNotExist } from "./searching";
import { handleVideo } from "./videos";

export const handlePlaylistIngest = async (
  job: Job<PlaylistIngestJob, CreatedPlaylist>,
  deps: Deps,
) => {
  // Steps to ingest a playlist
  console.log(job.data);

  const [playlist, videoIds] = await createOrGetPlaylist(job, deps);

  // Create an index on typesense if it doesn't exist already
  const searchIndex = await createIndexIfNotExist(playlist.id, deps.typesense);

  console.log("GOT PLAYLIST", playlist);

  const youtubeVideos = await getVideosFromPlaylist(job.data.playlistId);

  const videos = youtubeVideos.filter(
    (v) => !videoIds.includes(v.contentDetails?.videoId || ""),
  );

  console.log("VIDEOS TO CHECK", videos.length);

  // TODO: fix possible undefined
  const videoInputs = videos.map((v) => ({
    id: v.contentDetails?.videoId || "",
    title: v.snippet?.title || "",
    userId: job.data.createdBy,
    playlistId: playlist.id,
  }));

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

  console.log("INSERTED", inserted);
  console.log(
    "Failed to insert",
    handleVideoResults.filter((r) => r.result === "error").length,
  );

  return playlist;
};
