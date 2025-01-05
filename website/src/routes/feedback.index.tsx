import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { trpc } from "~/internal/trpc";

export const Route = createFileRoute("/feedback/")({
  component: FeedbackPage,
});

function FeedbackPage() {
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const feedbackMutation = trpc.feedback.submitFeedback.useMutation({
    onSuccess: () => {
      setSuccessMessage("Thank you for your feedback!");
      setFeedback("");
      setError("");
    },
    onError: (error) => {
      setError(error.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setError("Feedback cannot be empty.");
      return;
    }
    feedbackMutation.mutate({ feedback });
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <h1 className="text-xl font-semibold mb-4">Submit Your Feedback</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={feedback}
          onChange={(e) => {
            setFeedback(e.target.value);
            setError(""); // Reset error when typing starts
          }}
          placeholder="Write your feedback here and i promise ill read it..."
          className="w-full p-[10px] text-[14px] border rounded-[4px] focus:outline-none focus:ring focus:ring-blue-300"
          rows={5}
        />
        {error && (
          <div className="text-red-600 opacity-80 pt-1 text-sm">{error}</div>
        )}
        {successMessage && (
          <div className="text-green-600 opacity-80 pt-1 text-sm">
            {successMessage}
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="bg-strong-blue hover:bg-strong-blue/95 text-white px-6 py-2 rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={feedbackMutation.isPending}
          >
            {feedbackMutation.isPending ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
