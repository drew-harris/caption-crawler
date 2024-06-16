import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { trpc } from "~/internal/trpc";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await context.trpc.playlistQueue.whoAmI.ensureData();
    return;
  },
  component: IndexComponent,
});

function IndexComponent() {
  const [input, setInput] = useState("");
  const playlistData = trpc.youtube.getPlaylistInfo.useQuery({
    playlistUrl: input,
  });
  return (
    <>
      <div>Hello caption crawler</div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border block"
      />
      {JSON.stringify(playlistData.data)}
    </>
  );
}
