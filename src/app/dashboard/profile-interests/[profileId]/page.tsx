import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import ProfileInterestsPage from "./profileInterest";
import DashboardLayout from "@/src/components/layout/dashboardLayout";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ProfileInterestsIndex() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  console.log("session", session);

  return (
    <DashboardLayout user={session.user}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link
            href="/dashboard/profile-list"
            className="text-red-600 hover:underline"
          >
            Dashboard
          </Link>
          <span>/</span>
          <span>My Matrimonial Profiles</span>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Interested Profile
          </h1>
        </div>

        <ProfileInterestsPage user={session.user.id} />
      </div>
    </DashboardLayout>
  );
}
