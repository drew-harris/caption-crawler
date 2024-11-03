import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/stop-purchase")({
  component: StopPurchasePage,
});

function StopPurchasePage() {
  return <div className="max-w-2xl mx-auto mt-8 px-4"></div>;
}

