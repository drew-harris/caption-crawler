import { z } from "zod";
import { autoUserProcedure, publicProcedure, router } from "./base";
import { getChannelHandleFromUrl, getPlaylistIdFromUrl } from "shared/yt";
import { env } from "../env";
import { createId } from "shared";
import { JobType, PlaylistIngestJob } from "shared/types";
import {
  getChannelMetadata,
  getPlaylistMetadata,
  Metadata,
} from "~/serverUtils/metadata";
import { TB_collections, TB_Ownership } from "db";
import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";
import { alertPlaylistSubmission, logger } from "~/logging";

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

  queueCollection: autoUserProcedure
    .input(z.object({ url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Check if video count is within limits

      logger.info({ url: input.url }, "Queueing playlist");
      let type: "playlist" | "channel" = "playlist";
      let id: string | null = null;
      let metadata: Metadata | null = null;

      const playlistId = getPlaylistIdFromUrl(input.url);

      // If query param not found try to find channel id
      if (playlistId) {
        type = "playlist";
        id = playlistId;
        metadata = await getPlaylistMetadata({
          db: ctx.db,
          playlistId,
          youtubeKey: env.YOUTUBE_API_KEY,
        });
      } else {
        type = "channel";
        id = getChannelHandleFromUrl(input.url);
        if (!id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Could not find information for that URL",
          });
        }
        metadata = await getChannelMetadata({
          db: ctx.db,
          channelHandle: id,
          youtubeKey: env.YOUTUBE_API_KEY,
        });

        logger.info(
          { playlistId, channelHandle: id, metadata },
          "Got playlist metadata",
        );
        throw new Error("Got here");
      }

      // Check if theres already a playlist
      const [possibleCollection] = await ctx.db
        .select()
        .from(TB_collections)
        .where(
          and(
            eq(TB_collections.createdBy, ctx.user.id),
            eq(TB_collections.semantic, false),
            eq(TB_collections.youtubeId, id),
          ),
        );

      if (possibleCollection) {
        logger.info(
          { playlistId },
          "Found existing playlist during submission",
        );

        // Assign ownership if not already owned

        await ctx.db
          .insert(TB_Ownership)
          .values({
            id: createId("ownership"),
            collectionId: possibleCollection.id,
            userId: ctx.user.id,
            createdAt: new Date(),
          })
          .onConflictDoUpdate({
            target: [TB_Ownership.userId, TB_Ownership.collectionId],
            set: {
              userId: ctx.user.id,
              createdAt: new Date(),
            },
          });

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

      await ctx.db
        .insert(TB_Ownership)
        .values({
          id: createId("ownership"),
          collectionId: collection.id,
          userId: ctx.user.id,
          createdAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [TB_Ownership.userId, TB_Ownership.collectionId],
          set: {
            userId: ctx.user.id,
            createdAt: new Date(),
          },
        });

      await ctx.redis.set(`processing:${collection.id}`, "true");
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

      // NOTE: May be useful some day for limits
      // // Get fresh user data after collection creation
      // const [updatedUser] = await ctx.db
      //   .select()
      //   .from(TB_users)
      //   .where(eq(TB_users.id, ctx.user.id));

      if (!env["PUBLIC_URL"].includes("localhost")) {
        await alertPlaylistSubmission({
          title: metadata.title,
          description: metadata.description || "(No description)",
          userId: ctx.user.id,
          playlistUrl: input.url,
          imageUrl: metadata.thumbnailUrl,
        });
      }

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

  checkIfCollectionProcessing: publicProcedure
    .input(
      z.object({
        collectionId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const isProcessing = await ctx.redis.get(
        `processing:${input.collectionId}`,
      );
      return isProcessing === "true";
    }),
});
