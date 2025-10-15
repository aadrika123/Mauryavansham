import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import AdminOverview from "./admin-overview";
import AdmindashboardLayout from "@/src/components/layout/adminDashboardLayout";
import AdminDashboard from "./dashboard-view";
import { getUserDashboardData } from "@/src/features/searchProfile/actions/getUserDashboardData";

export default async function AdminOverviewPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  const userRole = session.user.role;
  const userId = session.user.id;
  
    const profileList = await getUserDashboardData(Number(userId));
    console.log("SearchProfilePage result:", profileList?.data);
  return (
    <AdmindashboardLayout user={session.user}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {userRole === "superAdmin" ? "Admin Overview" : "Admin Dashboard"}
          </h1>
          <p className="text-gray-600 mt-2">
            {userRole === "superAdmin"
              ? "Content moderation and system statistics"
              : "Manage your assigned content and operations"}
          </p>
        </div>

        {/* 👇 Conditional rendering */}
        {userRole === "superAdmin" ? <AdminOverview /> : <AdminDashboard profileList={profileList?.data || []}/>}
      </div>
    </AdmindashboardLayout>
  );
}
