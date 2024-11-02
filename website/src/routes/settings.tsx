import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { trpc } from "../lib/trpc";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = Route.useRouteContext();
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
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Email: {user.email}</p>
              <p>Account Type: {user.isPro ? 'Pro' : 'Free'}</p>
              <p>Videos: {user.videoCount} / {user.videoLimit}</p>
            </div>
          </CardContent>
        </Card>

        {!user.isPro && (
          <Card>
            <CardHeader>
              <CardTitle>Upgrade to Pro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Get unlimited video storage and more features!</p>
              <Button 
                onClick={handlePurchase}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Processing..." : "Purchase Pro"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
