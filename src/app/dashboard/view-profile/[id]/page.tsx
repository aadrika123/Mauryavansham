// app/view-profile/[userId]/page.tsx

import { getProfileById } from "@/src/features/getProfile/actions/getProfileById";
import ViewProfileById from "./viewProfileById";
import DashboardLayout from "@/src/components/layout/dashboardLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";


export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await getProfileById(id);

  if (!result.success || !result.data) {
    return <div className="p-4 text-red-500">Profile not found.</div>;
  }
   // 1. Session fetch karo
    const session = await getServerSession(authOptions);
  
    // 2. Agar session nahi mila to sign-in page par bhejo
    if (!session?.user?.id) {
      redirect("/sign-in");
    }
  
    // 3. Logged-in user ka ID lo
    // const userId = session.user.id;

  return (
    <DashboardLayout user={session.user}>
      <ViewProfileById profileData={result.data} />
    </DashboardLayout>
  );
}
