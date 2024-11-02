import { z } from "zod";
import { autoUserProcedure, publicProcedure, router } from "./base";
import { getPlaylistIdFromUrl } from "shared/yt";
import { env } from "../env";
import { createId } from "shared";
import { JobType, PlaylistIngestJob } from "shared/types";
import { getPlaylistMetadata } from "~/serverUtils/metadata";
import { TB_collections } from "db";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { logger } from "~/logging";

export const playlistQueueRouter = router({
  testAutoUser: autoUserProcedure.mutation(async () => {
    return "done";
  }),

  whoAmI: publicProcedure.query(({ ctx }) => {
    return {
      user: ctx.user || null,
    };
  }),

  logOut: autoUserProcedure.mutation(async ({ ctx }) => {
    ctx.auth.invalidateUserSessions(ctx.user.id);
    return null;
  }),

  queuePlaylist: autoUserProcedure
    .input(z.object({ url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Check if video count is within limits

      logger.info({ url: input.url }, "Queueing playlist");
      const playlistId = getPlaylistIdFromUrl(input.url);
      const metadata = await getPlaylistMetadata({
        db: ctx.db,
        playlistId,
        youtubeKey: env.YOUTUBE_API_KEY,
      });

      // Check if theres already a playlist
      const [possibleCollection] = await ctx.db
        .select()
        .from(TB_collections)
        .where(
          and(
            eq(TB_collections.createdBy, ctx.user.id),
            eq(TB_collections.semantic, false),
            eq(TB_collections.youtubeId, playlistId),
          ),
        );

      if (possibleCollection) {
        logger.info(
          { playlistId },
          "Found existing playlist during submission",
        );
        const job = await ctx.queue.add(createId("jobs"), {
          type: JobType.PLAYLIST_INGEST,
          collection: possibleCollection,
        } satisfies PlaylistIngestJob);
        return {
          jobId: job.id,
          metadata,
          collection: possibleCollection,
          user: ctx.user,
        };
      }

      logger.info({ playlistId }, "Got playlist metadata during upload");
      const collectionId = createId("collection");

      const [collection] = await ctx.db
        .insert(TB_collections)
        .values([
          {
            id: collectionId,
            semantic: false,
            createdBy: ctx.user.id,
            originalUrl: input.url,
            youtubeId: playlistId,
            createdAt: new Date(),
          },
        ])
        .returning();

      if (!collection) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create collection",
        });
      }

      const job = await ctx.queue.add(createId("jobs"), {
        type: JobType.PLAYLIST_INGEST,
        collection,
      } satisfies PlaylistIngestJob);

      if (!job.id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create job",
        });
      }

      await ctx.redis.set(`jobwith:${collection.id}`, job.id);

      return {
        jobId: job.id,
        collection: collection,
        metadata,
        user: ctx.user,
      };
    }),

  jobStatus: publicProcedure
    .input(
      z.object({
        jobId: z.string().optional(),
        collectionId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      let jobId = input.jobId;

      if (!jobId && input.collectionId) {
        const jobId = ctx.redis.get(`jobwith:${input.collectionId}`);
        if (!jobId) {
          return null;
        }
      } else if (!jobId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Must provide either jobId or collectionId",
        });
      }
      if (!jobId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Must provide either jobId or collectionId",
        });
      }

      const job = await ctx.queue.getJob(jobId);
      if (!job) {
        return null;
      }
      return {
        progress: job.progress,
        job: job.toJSON(),
        state: job.getState(),
      };
    }),
});
