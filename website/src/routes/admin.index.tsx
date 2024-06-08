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
  const [collections] = trpc.admin.getCollections.useSuspenseQuery();
  return (
    <div>
      <div>Admin Page</div>
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
