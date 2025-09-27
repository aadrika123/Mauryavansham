import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import AdmindashboardLayout from "@/src/components/layout/adminDashboardLayout";
import CreateEventForm from "./createEventForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
// import UserManagement from "./userManagementList";

export default async function AdminAdsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  return (
    <AdmindashboardLayout user={session.user}>
      <div className="container mx-auto px-4 ">
       <div className="flex items-center gap-1">
          <Link
            href="/admin/overview"
            className="flex items-center  text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 text-red-700" />
            <span className="text-red-700">Dashboard / </span>
          </Link>
          <h1 className=" font-bold text-red-700">Create Event</h1>
        </div>
        <CreateEventForm />
      </div>
    </AdmindashboardLayout>
  );
}
