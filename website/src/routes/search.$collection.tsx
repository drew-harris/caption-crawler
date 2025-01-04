import { createFileRoute } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SearchResultCard } from "~/components/SearchResultCard";
import { trpc } from "~/internal/trpc";

export const Route = createFileRoute("/search/$collection")({
  loader: async ({ params, context }) => {
    await context.trpc.metadata.getMetadataFromCollection.ensureData({
      collectionId: params.collection,
    });
    await context.trpc.collections.getCollection.ensureData({
      collectionId: params.collection,
    });
    return {
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
  const [collection, { refetch }] =
    trpc.collections.getCollection.useSuspenseQuery(
      {
        collectionId: loaderData.collectionId,
      },
      {
        refetchInterval: 1000,
      },
    );

  const { data: isProcessing } =
    trpc.playlistQueue.checkIfCollectionProcessing.useQuery(
      {
        collectionId: loaderData.collectionId,
      },
      {
        refetchInterval: 2000,
      },
    );

  useEffect(() => {
    refetch();
  }, [isProcessing]);

  const [searchQuery, setSearchQuery] = useState("");

  const timeSince = formatDistanceToNow(collection.createdAt);

  const { data: searchData } = trpc.search.search.useQuery(
    {
      collection: loaderData.collectionId,
      query: searchQuery,
    },
    {
      enabled: searchQuery.length > 0,
    },
  );

  return (
    <div className="flex flex-col pt-10 items-center">
      <div>{searchQuery}</div>
      {metadata.thumbnailUrl && (
        <div className="relative">
          <img
            src={metadata.thumbnailUrl}
            className="w-[70vw] max-w-[400px] object-cover shadow-flat rounded-lg aspect-video"
          />
          {isProcessing && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
      )}
      <div className="h-5" />
      <div className="text-navy text-center text-balance font-bold text-[20px]">
        {metadata.title}
      </div>
      <div className="font-medium text-[13px] opacity-50">
        Last updated: {timeSince} ago
      </div>
      <div className="font-medium text-[13px] opacity-50">
        {collection.videoCount} videos
      </div>
      <div className="h-3" />
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 border-2 border-tan-200 text-[14px] placeholder:text-[#939393] w-full max-w-[316px]"
        placeholder="Search Captions..."
      />
      {searchData?.hits && (
        <div className="w-full max-w-[600px] mt-4 space-y-4">
          {searchData.hits.map((hit) => (
            <SearchResultCard key={hit.document.id} hit={hit} />
          ))}
        </div>
      )}
    </div>
  );
}
