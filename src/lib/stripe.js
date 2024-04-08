import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import User from "@/models/User";
import { getServerSession } from "next-auth";

export async function hasSubscription() {
  const session = await getServerSession(authOptions);

  if (session) {
    const user = await User.findById(session?.user?.id);

    const subscriptions = await stripe.subscriptions.list({
      customer: String(user?.stripe_customer_id),
    });

    console.log(subscriptions);

    return { hasSubs: subscriptions.data.length > 0, subs: subscriptions };
  }

  return { hasSubs: false, subs: [] };
}
