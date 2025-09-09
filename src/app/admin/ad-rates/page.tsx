import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/src/components/layout/dashboardLayout";
import AdmindashboardLayout from "@/src/components/layout/adminDashboardLayout";
import dynamic from "next/dynamic";
// import AdRatePage from "./adRatesPage";
const AdRatePage = dynamic(() => import("./adRatesPage"), {
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
       
        <AdRatePage />
      </div>
    </AdmindashboardLayout>
  );
}
