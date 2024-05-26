import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "../internal/trpc";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await context.trpc.playlistQueue.whoAmI.ensureData();
    return;
  },
  component: IndexComponent,
});

function IndexComponent() {
  const utils = trpc.useUtils();

  const [whoIAm] = trpc.playlistQueue.whoAmI.useSuspenseQuery();

  const autoUserMutation = trpc.playlistQueue.testAutoUser.useMutation({
    onSuccess: () => utils.playlistQueue.whoAmI.invalidate(),
  });

  return (
    <div>
      <pre>{JSON.stringify(whoIAm)}</pre>
      <button
        onMouseDown={() => {
          autoUserMutation.mutate();
        }}
      >
        Log In
      </button>
    </div>
  );
}
