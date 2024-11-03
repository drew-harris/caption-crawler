import { createFileRoute } from "@tanstack/react-router";
import { Constants } from "shared";

export const Route = createFileRoute("/stop-purchase")({
  component: StopPurchasePage,
});

function StopPurchasePage() {
  return (
    <div className="max-w-2xl mx-auto mt-32 px-4 text-center">
      <h1 className="text-4xl text-balance font-bold text-navy mb-6">
        Before proceeding: connect your Google account
      </h1>

      <p className="text-lg mb-8 text-balance">
        Anonymous accounts can't make purchases. Connecting your Google account
        will keep you logged in on every device.
      </p>

      <p className="text-lg mb-8 text-balance">
        Get {Constants.BONUS_GOOGLE_VIDEOS} free video scans by connecting your
        Google account
      </p>

      <button
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        onClick={() => {
          // TODO: Implement Google sign in
          console.log("Sign in with Google clicked");
        }}
      >
        <img src="/google.svg" alt="" className="w-5 h-5 mr-2" />
        Sign in with Google
      </button>
    </div>
  );
}
