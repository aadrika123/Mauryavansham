// dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";
import { getAllProfiles } from "@/src/features/searchProfile/actions/getAllProfiles";
import DashboardProfileList from "./dashboardProfileList";
import DashboardLayout from "@/src/components/layout/dashboardLayout";
import { updateProfileById } from "@/src/features/updateProfileById/actions/updateProfileById";
// import { updateProfileById } from "@/src/features/updateProfile/actions/updateProfileById"; // ✅ import

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const profileList = await getAllProfiles();

  return (
    <DashboardLayout user={session.user}>
      <DashboardProfileList
        profileList={profileList?.data || []}
        updateProfileById={updateProfileById} // ✅ pass function
      />
    </DashboardLayout>
  );
}
