// app/view-profile/[userId]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/src/components/layout/dashboardLayout";
import { useEffect, useState } from "react";
import UserProfilePage from "./update-userProfile";
import { getUserById } from "@/src/features/getUserById/actions/getUserById";

export default async function ViewUserProfile({
  params,
}: {
  params: { id: string };
}) {
  // 1. Session fetch
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // 2. URL se userId lo (params se)
  const { id } = params;

  const result = await getUserById(id);
  console.log("Fetched user data:", result);

  return (
    <DashboardLayout user={session.user} data={result.data}>
      <UserProfilePage data={result.data} />
    </DashboardLayout>
  );
}
