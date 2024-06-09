import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await context.trpc.playlistQueue.whoAmI.ensureData();
    return;
  },
  component: IndexComponent,
});

function IndexComponent() {
  return <div>Hello Caption Crawler</div>;
}
