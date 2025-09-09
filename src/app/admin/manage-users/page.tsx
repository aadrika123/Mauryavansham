import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/src/components/layout/dashboardLayout";
import AdmindashboardLayout from "@/src/components/layout/adminDashboardLayout";
import dynamic from "next/dynamic";
// import ManageUsersPage from "./manageUsersPage";
// import UserManagement from "./userManagementList";
const ManageUsersPage = dynamic(() => import("./manageUsersPage"), {
  ssr: false,
});

export default async function AdminAdsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || (session.user.role !== "admin" && session.user.role !== "superAdmin")) {
    redirect("/sign-in");
  }

  return (
    <AdmindashboardLayout user={session.user}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            User's Management{" "}
          </h1>
          <p className="text-gray-600 mt-2">
            Review and moderate user roles and statuses
          </p>
        </div>
        <ManageUsersPage />
      </div>
    </AdmindashboardLayout>
  );
}
