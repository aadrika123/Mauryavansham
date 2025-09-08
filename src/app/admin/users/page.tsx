import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/src/components/layout/dashboardLayout";
import AdmindashboardLayout from "@/src/components/layout/adminDashboardLayout";
import AdminUserApprovalPage from "./userManagementList";
// import UserManagement from "./userManagementList";

export default async function AdminAdsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <AdmindashboardLayout user={session.user}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            User's Management{" "}
          </h1>
          <p className="text-gray-600 mt-2">
            Review and moderate user submissions
          </p>
        </div>
        <AdminUserApprovalPage />
      </div>
    </AdmindashboardLayout>
  );
}
