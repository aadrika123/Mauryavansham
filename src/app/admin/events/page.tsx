	

import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import AdmindashboardLayout from "@/src/components/layout/adminDashboardLayout";
import dynamic from "next/dynamic";

// Dynamically import CreateEventForm so it only runs on client
const CreateEventForm = dynamic(() => import("./createEventForm"), {
  ssr: false,
});

export default async function AdminAdsPage() {
  const session = await getServerSession(authOptions);

  if (
    !session?.user?.id ||
    (session.user.role !== "admin" && session.user.role !== "superAdmin")
  ) {
    redirect("/sign-in");
  }

  return (
    <AdmindashboardLayout user={session.user}>
      <div className="container mx-auto px-4 py-8">
        <CreateEventForm />
      </div>
    </AdmindashboardLayout>
  );
}