import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getProductIdFromSubscription, hasSubscription } from "@/lib/stripe";

export const POST = async (req) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const data = await req.json();
  await connectDB();
  const userSession = await getServerSession(authOptions);

  const dbUser = await User.findById(userSession.user.id);

  if (!dbUser) {
    return NextResponse.json({ msg: "Unauth" }, { status: 401 });
  }

  const user_stripe_customer_id = dbUser.stripe_customer_id;

  if (!user_stripe_customer_id) {
    return NextResponse.json({ msg: "Unauth" }, { status: 401 });
  }

  const returnUrl = process.env.NEXT_PUBLIC_DOMAIN;

  let portalSession;

  const type = data.type;
  const subinfo = await hasSubscription();
  const subId = subinfo.subId;

  if (type === "update") {
    portalSession = await stripe.billingPortal.sessions.create({
      customer: String(user_stripe_customer_id),
      return_url: returnUrl,
      flow_data: {
        type: "subscription_update",
        subscription_update: {
          subscription: subId,
        },
      },
    });
  } else if (type === "cancel") {
    portalSession = await stripe.billingPortal.sessions.create({
      customer: String(user_stripe_customer_id),
      return_url: returnUrl,
      flow_data: {
        type: "subscription_cancel",
        subscription_cancel: {
          subscription: subId,
        },
      },
    });
  }

  return NextResponse.json(portalSession.url);
};
