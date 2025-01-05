import { z } from "zod";
import { autoUserProcedure, router } from "./base";
import { TB_Feedback } from "db";
import { createId } from "shared";

export const feedbackRouter = router({
  submitFeedback: autoUserProcedure
    .input(
      z.object({
        feedback: z
          .string()
          .min(1, "Feedback is required")
          .max(500, "Feedback must be less than 500 characters"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const feedbackId = createId("feedback");

      await ctx.db.insert(TB_Feedback).values({
        id: feedbackId,
        feedback: input.feedback,
        submittedAt: new Date(), // Current date for submission time
        userId: ctx.user.id, // Ensure the feedback is associated with the authenticated user
      });

      return { success: true, message: "Thank you for your feedback!" };
    }),
});
