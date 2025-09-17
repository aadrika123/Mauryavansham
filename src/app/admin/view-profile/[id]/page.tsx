// app/view-profile/[userId]/page.tsx

import { getProfileById } from "@/src/features/getProfile/actions/getProfileById";
import ViewProfileById from "./viewProfileById";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AdmindashboardLayout from "@/src/components/layout/adminDashboardLayout";


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
    <AdmindashboardLayout user={session.user}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link href="/dashboard/profile-list" className="text-red-600 hover:underline">
            Profiles List
          </Link>
          <span>/</span>
          <span>View Profile</span>
        </div>
      </div>
      <ViewProfileById profileData={result.data} />
    </AdmindashboardLayout>
  );
}
