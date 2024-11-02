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
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-white border border-tan-200 rounded-[4px] shadow-sm p-6 mb-4">
        <h2 className="text-lg font-semibold mb-4">Usage</h2>
        <div className="mb-6">
          <p className="text-[14px] text-gray-700">
            Videos: {user.videoCount} / {user.videoLimit}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-strong-blue h-2 rounded-full" 
              style={{ 
                width: `${Math.min((user.videoCount / user.videoLimit) * 100, 100)}%`
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-tan-200 rounded-[4px] shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Billing</h2>
        <p className="text-[14px] text-gray-600 mb-4">
          You can purchase a subscription to increase your video limit.
        </p>
        <button
          className="bg-strong-blue hover:bg-strong-blue/95 text-white px-[31.5px] py-[10px] rounded-[4px]"
          onClick={handlePurchase}
        >
          Purchase
        </button>
      </div>
    </div>
  );
}
