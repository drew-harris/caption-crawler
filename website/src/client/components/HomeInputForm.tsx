import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { trpc } from "~/internal/trpc";

export function HomeInputForm() {
  const [input, setInput] = useState("");
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
    { enabled: false }
  );

  function isValidUrl(str: string) {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!input) return;

    if (isValidUrl(input)) {
      try {
        const info = await playlistInfoQuery.refetch();
        if (!info.data) throw new Error("No playlist info returned");
        navigate({
          to: "/search/$collection",
          params: { collection: info.data.id },
        });
      } catch (error) {
        console.error("Failed to process playlist URL:", error);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-8 px-4">
      <div className="relative">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setIsSearching(
              e.target.value.length > 0 && !isValidUrl(e.target.value),
            );
          }}
          placeholder="Enter a YouTube playlist URL or search for playlists..."
          className="bg-transparent overflow-hidden focus:outline-none group w-full p-[10px] text-[14px]"
        />

        {isSearching && searchMutation.data && (
          <div className="absolute w-full bg-white shadow-lg rounded-b-lg mt-1 border border-gray-200 max-h-[300px] overflow-y-auto z-10">
            {searchMutation.data.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => {
                  navigate({
                    to: "/search/$collection",
                    params: { collection: playlist.id },
                  });
                }}
                className="bg-strong-blue hover:bg-strong-blue/95 placeholder:text-[#939393] px-[31.5px] text-white hidden md:inline rounded-tr-[4px] rounded-br-[4px]"
              >
                <img
                  src={playlist.thumbnailUrl}
                  alt=""
                  className="w-12 h-12 object-cover rounded"
                />
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
          className="bg-strong-blue hover:bg-strong-blue/95 placeholder:text-[#939393] px-[31.5px] text-white hidden md:inline rounded-tr-[4px] rounded-br-[4px]"
        >
          Scan
        </button>
        <button
          type="button"
          className="md:hidden border-l-tan-200 border-l-2 text-[14px] text-[#9a9a9a] px-[10px]"
          onClick={async () => {
            try {
              const text = await navigator.clipboard.readText();
              setInput(text);
            } catch (e) {
              alert("Could not paste text, sorry");
            }
          }}
        >
          Paste
        </button>
      </div>
    </form>
  );
}
