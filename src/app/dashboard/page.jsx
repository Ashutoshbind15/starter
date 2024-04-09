import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  createCustomerOfUserIfNull,
  getProductIdFromSubscription,
  hasSubscription,
} from "@/lib/stripe";
import { connectDB } from "@/lib/db";
import CustomBillingTable from "@/components/PageComponents/Pricing/CustomBillingTable";

const DashboardPage = async () => {
  await connectDB();
  const serverSess = await getServerSession(authOptions);
  if (!serverSess || !serverSess.user) {
    return <div>Unauthorized</div>;
  }
  const cid = await createCustomerOfUserIfNull();
  const subInfo = await hasSubscription();

  // info to be passed to client has only the current sub period start and end, the curr sub product id

  const modifiedSubinfo = {
    hasSubscription: subInfo ? true : false,
    productId: subInfo.productId,
    subscriptionStartPeriod: subInfo.startTime,
    subsriptionEndPeriod: subInfo.endTime,
  };

  return (
    <div className="min-h-screen flex flex-col gap-y-8 items-center justify-center">
      <div>DashboardPage</div>

      <Card className="w-1/3">
        <CardHeader>
          <CardDescription>{serverSess?.user?.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription>{serverSess?.user?.id}</CardDescription>
        </CardContent>
        <CardFooter>
          <Button>
            <Link href={"/api/auth/signout"}>SignOut</Link>
          </Button>
        </CardFooter>
      </Card>

      <CustomBillingTable subscriptionInfo={modifiedSubinfo} />
    </div>
  );
};

export default DashboardPage;
