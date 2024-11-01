import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { trpc } from "~/internal/trpc";

export function HomeInputForm() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const searchMutation = trpc.youtube.searchPlaylists.useQuery(
    { query: input },
    {
      enabled: isSearching && !isValidUrl(input),
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
      setError(error.message || "Something went wrong");
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

        {isSearching && searchMutation.data && (
          <div className="absolute w-full bg-white shadow-lg rounded-b-lg mt-1 border border-gray-200 max-h-[300px] overflow-y-auto z-10">
            {searchMutation.data.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => {
                  submitPlaylistMutation.mutate({
                    url: `https://www.youtube.com/playlist?list=${playlist.id}`,
                  });
                }}
                className="bg-strong-blue hover:bg-strong-blue/95 placeholder:text-[#939393] px-[31.5px] text-white hidden md:inline rounded-tr-[4px] rounded-br-[4px]"
              >
                {playlist.thumbnailUrl && (
                  <img
                    src={playlist.thumbnailUrl}
                    alt=""
                    className="w-12 h-12 object-cover rounded"
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
