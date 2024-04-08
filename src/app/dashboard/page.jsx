import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const DashboardPage = async () => {
  const serverSess = await getServerSession(authOptions);
  console.log(serverSess);

  return (
    <div>
      <div>DashboardPage</div>
      <Button>
        <Link href="/api/auth/signout">Sign Out</Link>
      </Button>
    </div>
  );
};

export default DashboardPage;
