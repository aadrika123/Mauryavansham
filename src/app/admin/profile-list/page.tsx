// dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";
import { getAllProfiles } from "@/src/features/searchProfile/actions/getAllProfiles";
import DashboardProfileList from "./dashboardProfileList";
import DashboardLayout from "@/src/components/layout/dashboardLayout";
import { updateProfileById } from "@/src/features/updateProfileById/actions/updateProfileById";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AdmindashboardLayout from "@/src/components/layout/adminDashboardLayout";
// import { updateProfileById } from "@/src/features/updateProfile/actions/updateProfileById"; // ✅ import

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const profileList = await getAllProfiles(Number(session.user.id));
  console.log("profileList", profileList);

  return (
    <AdmindashboardLayout user={session.user}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link href="/admin/overview" className="text-red-600 hover:underline">
            Dashboard
          </Link>
          <span>/</span>
          <span>My Matrimonial Profiles</span>
        </div>
      </div>
      <DashboardProfileList
        profileList={profileList?.data || []}
        updateProfileById={updateProfileById}
        user={session.user}
      />
    </AdmindashboardLayout>
  );
}
