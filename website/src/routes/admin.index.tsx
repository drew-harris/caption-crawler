import { createFileRoute, redirect } from "@tanstack/react-router";
import { trpc } from "~/internal/trpc";

export const Route = createFileRoute("/admin/")({
  async beforeLoad(opts) {
    const user = await opts.context.trpc.users.whoAmI.fetch();
    if (!user.user?.isAdmin) {
      throw redirect({
        to: "/",
      });
    }
  },

  wrapInSuspense: true,
  component: AdminPage,
});

function AdminPage() {
  const utils = trpc.useUtils();
  const [collections] = trpc.admin.getCollections.useSuspenseQuery();
  const dropAllMutation = trpc.admin.nukeAllPlaylists.useMutation({
    onSuccess() {
      utils.admin.getCollections.invalidate();
    },
  });
  const dropAll = () => {
    confirm("Are you sure you want to drop all collections?")
      ? dropAllMutation.mutate()
      : null;
  };
  return (
    <div>
      <div>Admin Page</div>
      <button onClick={dropAll} className="bg-red-500">
        DROP ALL
      </button>
      {collections.map((c) => (
        <a
          target="_blank"
          className="block"
          href={`https://www.youtube.com/playlist?list=${c.name}`}
          key={c.name}
        >
          {c.name} {c.num_documents}
        </a>
      ))}
    </div>
  );
}
