import { autoUserProcedure, router } from "./base";
import Stripe from "stripe";
import { env } from "../env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const stripeRouter = router({
  createCheckoutSession: autoUserProcedure.mutation(async ({ ctx }) => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${env.PUBLIC_URL}/settings?success=true`,
      cancel_url: `${env.PUBLIC_URL}?canceled=true`,
      return_url: `${env.PUBLIC_URL}/settings?success=true`,
      metadata: {
        userId: ctx.user.id,
      },
    });

    return { url: session.url };
  }),
});
