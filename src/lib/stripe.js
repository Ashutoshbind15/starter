import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import Stripe from "stripe";
import { connectDB } from "./db";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function hasSubscription() {
  const session = await getServerSession(authOptions);

  if (session) {
    const user = await User.findById(session?.user?.id);

    const subscriptions = await stripe.subscriptions.list({
      customer: String(user?.stripe_customer_id),
    });

    if (subscriptions.data.length === 0) return null;

    const subscription = subscriptions.data[0];
    const subId = subscription.id;
    const subItem = subscription.items.data[0];
    const productId = subItem.price.product;
    const startTime = subscription.current_period_start;
    const endTime = subscription.current_period_end;

    return { subId, productId, startTime, endTime };
  }

  return null;
}

export const createCustomerOfUserIfNull = async () => {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (session) {
    const user = await User.findById(session?.user?.id);

    if (!user?.stripe_customer_id) {
      const customer = await stripe.customers.create({
        email: String(user?.email),
      });

      console.log(customer);

      user.stripe_customer_id = customer.id;
      await user.save();

      return customer.id;
    } else {
      return user.stripe_customer_id;
    }
  }

  return null;
};

export const generateCustomerPortalLink = async (customer_id) => {
  const session = await getServerSession(authOptions);

  if (session) {
    const link = await stripe.billingPortal.sessions.create({
      customer: customer_id,
      return_url: process.env.NEXT_PUBLIC_DOMAIN,
    });

    return link.url;
  }

  return null;
};

export const subscription_name_map = {
  standard: process.env.NEXT_PUBLIC_STANDARD_PRODUCT_ID,
  premium: process.env.NEXT_PUBLIC_PREMIUM_PRODUCT_ID,
};

// allow user to send in an array of allowed subscription names

export const isActionAllowedForAny = async (subscription_names) => {
  const subInfo = await hasSubscription();
  if (!subInfo) return false;

  const allowed = subscription_names.map((name) => {
    return subInfo.productId === subscription_name_map[name];
  });

  return allowed.includes(true);
};
