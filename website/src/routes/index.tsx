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

  const logOutMutation = trpc.playlistQueue.logOut.useMutation({
    onSuccess: () => utils.playlistQueue.whoAmI.invalidate(),
  });

  return (
    <div className="flex min-w-[300px] w-max m-auto bg-gray-800 flex-col gap-4 border-2 border-gray-700 p-8 rounded-xl">
      <pre>{JSON.stringify(whoIAm, null, 2)}</pre>
      {!whoIAm.user ? (
        <button
          className="bg-gray-500 p-2 rounded-md "
          onMouseDown={() => {
            autoUserMutation.mutate();
          }}
        >
          Log In
        </button>
      ) : (
        <button
          className="bg-red-500 p-2 rounded-md "
          onMouseDown={() => {
            logOutMutation.mutate();
          }}
        >
          Log Out
        </button>
      )}
    </div>
  );
}
