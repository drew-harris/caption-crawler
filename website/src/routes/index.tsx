import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
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
  const submitPlaylistMutation = trpc.playlistQueue.queuePlaylist.useMutation();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!input) {
      return;
    }
    submitPlaylistMutation.mutate({
      url: input,
    });
  };

  return (
    <>
      <div className="text-3xl text-blue-800 m-auto text-center font-semibold pt-48">
        Search Deep On Youtube
      </div>
      <form onSubmit={submit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border block"
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
