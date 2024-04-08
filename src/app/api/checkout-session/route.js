import Stripe from "stripe";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const data = await req.json();

  const prices = await stripe.prices.list({
    lookup_keys: [data.lookup_key],
    expand: ["data.product"],
  });
  const session = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    line_items: [
      {
        price: prices.data[0].id,
        // For metered billing, do not pass quantity
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/pricing/success/?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/pricing/failure/?canceled=true`,
  });

  console.log(session);

  return NextResponse.json(session.url);
};
