import { useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";
import { useDebounce } from "~/hooks/useDebounce";
import { trpc } from "~/internal/trpc";

export function HomeInputForm() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debouncedInput = useDebounce(input, 300);
  const navigate = useNavigate();

  const stripeCheckoutMutation =
    trpc.stripe.createCheckoutSession.useMutation();

  const searchMutation = trpc.youtube.searchPlaylists.useQuery(
    { query: debouncedInput },
    {
      enabled:
        isSearching &&
        !isValidUrl(debouncedInput) &&
        debouncedInput.length >= 3,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  );

  const playlistInfoQuery = trpc.youtube.getPlaylistInfo.useQuery(
    { playlistUrl: input },
    { enabled: false },
  );

  const utils = trpc.useUtils();

  function isValidUrl(str: string) {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }

  const submitPlaylistMutation = trpc.playlistQueue.queuePlaylist.useMutation({
    onSuccess(data, variables, context) {
      // Preset the required metadata
      utils.metadata.getMetadataFromCollection.setData(
        { collectionId: data.collection.id },
        data.metadata,
      );
      utils.collections.getCollection.setData(
        { collectionId: data.collection.id },
        data.collection,
      );
      navigate({
        to: "/search/$collection",
        params: {
          collection: data.collection.id,
        },
        search: {
          j: data.jobId,
        },
      });
    },
    onError(error, variables, context) {
      if (error.message.includes("playlist limit")) {
        if (
          confirm(
            "You've reached your playlist limit. Would you like to upgrade to add more playlists?",
          )
        ) {
          stripeCheckoutMutation.mutate(undefined, {
            onSuccess: ({ url }) => {
              if (url) window.location.href = url;
            },
          });
        }
      } else {
        setError(error.message || "Something went wrong");
      }
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Verify inputText is a url
    if (!input.match(/^https?:\/\//)) {
      alert("Please enter a valid URL");
      return;
    }

    submitPlaylistMutation.mutate({
      url: input,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-8 px-4">
      <div className="relative flex bg-white border border-tan-200 rounded-[4px] shadow-sm">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setIsSearching(
              e.target.value.length > 0 && !isValidUrl(e.target.value),
            );
          }}
          placeholder="Enter a YouTube playlist URL or search for playlists..."
          className="flex-1 overflow-hidden focus:outline-none group w-full p-[10px] text-[14px] rounded-l-[4px]"
        />
        {isSearching && searchMutation.isLoading && (
          <div className="absolute right-24 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          </div>
        )}

        {isSearching && searchMutation.data && (
          <div className="absolute left-0 right-0 top-full bg-white shadow-lg rounded-b-lg mt-1 border border-gray-200 max-h-[300px] overflow-y-auto z-10">
            {searchMutation.data.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => {
                  submitPlaylistMutation.mutate({
                    url: `https://www.youtube.com/playlist?list=${playlist.id}`,
                  });
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left"
              >
                {playlist.thumbnailUrl && (
                  <img
                    src={playlist.thumbnailUrl}
                    alt=""
                    className="w-12 h-12 object-cover rounded flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{playlist.title}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {playlist.channelTitle}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="bg-strong-blue hover:bg-strong-blue/95 px-[31.5px] text-white rounded-tr-[4px] rounded-br-[4px]"
        >
          Scan
        </button>
      </div>
    </form>
  );
}
