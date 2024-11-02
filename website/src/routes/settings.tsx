import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "~/internal/trpc";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  loader: (x) => {
    return {
      user: x.context.user,
    };
  },
});

function SettingsPage() {
  const { user } = Route.useLoaderData();
  const mutation = trpc.stripe.createCheckoutSession.useMutation();

  const handlePurchase = async () => {
    const result = await mutation.mutateAsync();
    if (result.url) {
      window.location.href = result.url;
    }
  };

  if (!user) {
    return <div>Please log in to view settings</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="grid gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Billing</h2>
          <p className="text-gray-500 mb-4">
            You can purchase a subscription to increase your video limit.
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handlePurchase}
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
}
