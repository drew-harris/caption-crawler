import { Job } from "bullmq";
import { TB_playlists, TB_videos } from "db";
import { eq } from "drizzle-orm";
import { CreatedPlaylist, PlaylistIngestJob } from "shared/types";
import { getPlaylistDisplayInfo } from "shared/yt";
import { Deps } from ".";
import { env } from "./env";

export async function createOrGetPlaylist(
  job: Job<PlaylistIngestJob, CreatedPlaylist>,
  deps: Deps,
): Promise<[CreatedPlaylist, string[]]> {
  console.log("Creating or getting playlist");
  // Check database for playlist
  const possiblePlaylist = await deps.db
    .select()
    .from(TB_playlists)
    .where(eq(TB_playlists.id, job.data.playlistId))
    .then((a) => a.at(0));

  console.log("POSSIBLE PLAYLIST", possiblePlaylist);

  if (!possiblePlaylist) {
    console.log("Creating playlist");
    const playlist = await createPlaylist(job, deps);
    return [playlist, []];
  }

  // Get the list of already processed video ids
  const videos = await deps.db
    .select()
    .from(TB_videos)
    .where(eq(TB_videos.playlistId, job.data.playlistId));
  const videoIds = videos.map((v) => v.id);

  return [possiblePlaylist, videoIds];
}

async function createPlaylist(
  job: Job<PlaylistIngestJob, CreatedPlaylist>,
  deps: Deps,
) {
  const playlistInfo = await getPlaylistDisplayInfo(
    env.YOUTUBE_API_KEY,
    job.data.playlistId,
  );

  if (!playlistInfo.channelTitle) {
    throw new Error("Could not find channel title");
  }

  if (!playlistInfo.channelId) {
    throw new Error("Could not find channel ID");
  }

  if (!playlistInfo.title) {
    throw new Error("Could not find playlist title");
  }

  const thumbnail = playlistInfo?.thumbnails?.default?.url;
  if (!thumbnail) {
    throw new Error("Could not find thumbnail");
  }

  // Create the playlist in the database
  const created = await deps.db
    .insert(TB_playlists)
    .values({
      id: job.data.playlistId,
      title: playlistInfo.title,
      description: playlistInfo.description,
      channelId: playlistInfo.channelId,
      channelTitle: playlistInfo.channelTitle,
      thumbnailUrl: thumbnail,
      createdBy: job.data.createdBy,
      originalUrl: job.data.originalUrl,
      videoCount: 0,
    })
    .returning()
    .then((a) => a.at(0));

  if (!created) {
    throw new Error("Could not create playlist");
  }

  return created;
}
