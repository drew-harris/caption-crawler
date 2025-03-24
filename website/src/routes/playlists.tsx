import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "~/internal/trpc";
import { formatDistanceToNow } from "date-fns";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/playlists")({
  component: PlaylistsPage,
  loader: async ({ context }) => {
    await context.trpc.collections.getAllCollections.ensureData();
  },
});

function PlaylistsPage() {
  const { data: collections } = trpc.collections.getAllCollections.useQuery();

  return (
    <div className="flex flex-col pt-10 items-center">
      <h1 className="text-3xl font-bold text-navy mb-8">Your Playlists</h1>
      <div className="w-full max-w-[800px] space-y-4">
        {collections?.map((collection) => (
          <Link
            key={collection.id}
            to="/search/$collection"
            params={{ collection: collection.id }}
            className="block p-4 border-2 border-tan-200 bg-white rounded-lg hover:border-tan-300 transition-colors"
          >
            <div className="flex flex-col md:flex-row items-left md:items-center gap-4">
              <img
                src={collection.metadata.thumbnailUrl}
                alt={collection.metadata.title}
                className="md:w-36 rounded-md md:self-auto self-center aspect-video object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold text-navy">
                  {collection.metadata.title}
                </h2>
                <p className="text-sm opacity-60">
                  {collection.metadata.channelTitle}
                </p>
                <p className="text-sm opacity-60">
                  Added {formatDistanceToNow(collection.createdAt)} ago
                </p>
                <p className="text-sm opacity-60">
                  {collection.videoCount} videos
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
