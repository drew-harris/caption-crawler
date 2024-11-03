import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/stop-purchase")({
  component: StopPurchasePage,
});

function StopPurchasePage() {
  return (
    <div className="max-w-2xl mx-auto mt-32 px-4 text-center">
      <h1 className="text-4xl font-bold text-strong-blue mb-6">
        Before proceeding,<br />
        connect your Google<br />
        account
      </h1>
      
      <p className="text-lg mb-8">
        Anonymous accounts can't make purchases.<br />
        Connecting your Google account will keep<br />
        you logged in on every device.
      </p>

      <button 
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        onClick={() => {
          // TODO: Implement Google sign in
          console.log("Sign in with Google clicked");
        }}
      >
        <img 
          src="/google.svg" 
          alt="" 
          className="w-5 h-5 mr-2"
        />
        Sign in with Google
      </button>
    </div>
  );
}

