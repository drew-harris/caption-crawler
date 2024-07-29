import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { z } from "zod";
import { RouterOutput, trpc } from "~/internal/trpc";

const params = z.object({
  j: z.string().optional(),
});

type JobResponse = RouterOutput["playlistQueue"]["jobStatus"];

export const Route = createFileRoute("/search/$collection")({
  validateSearch: params,
  loaderDeps(opts) {
    return { jobId: opts.search.j };
  },
  loader: async ({ params, deps, context }) => {
    if (deps.jobId) {
      await context.trpc.playlistQueue.jobStatus.ensureData({
        jobId: deps.jobId,
      });
    }
    await context.trpc.metadata.getMetadataFromCollection.ensureData({
      collectionId: params.collection,
    });
    await context.trpc.collections.getCollection.ensureData({
      collectionId: params.collection,
    });
    return {
      jobId: deps.jobId,
      collectionId: params.collection,
    };
  },
  component: SearchPage,
});

function SearchPage() {
  const loaderData = Route.useLoaderData();
  const [metadata] = trpc.metadata.getMetadataFromCollection.useSuspenseQuery({
    collectionId: loaderData.collectionId,
  });
  const [collection] = trpc.collections.getCollection.useSuspenseQuery({
    collectionId: loaderData.collectionId,
  });
  return (
    <div>
      <div>{metadata.title}</div>
      <div>{metadata.description}</div>
      <div>{collection.videoCount} Videos</div>
      {metadata.thumbnailUrl && <img src={metadata.thumbnailUrl} />}
    </div>
  );
}

