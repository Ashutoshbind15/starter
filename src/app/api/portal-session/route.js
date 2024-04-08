import Stripe from "stripe";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const data = await req.json();

  const session_id = data.session_id;
  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

  const returnUrl = process.env.NEXT_PUBLIC_DOMAIN;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  });

  console.log(portalSession);

  return NextResponse.json(portalSession.url);
};
