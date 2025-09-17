// import { getAllProfiles } from "@/src/features/searchProfile/actions"
import { getAllProfiles } from "@/src/features/searchProfile/actions/getAllProfiles";
// import SearchProfilesClient from "@/src/app/(home)/search-profile/searchProfileClient"
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/src/components/layout/dashboardLayout";
import SearchProfilesClient from "./searchProfileClient";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AdmindashboardLayout from "@/src/components/layout/adminDashboardLayout";

export default async function SearchProfilePage() {
  const session = await getServerSession(authOptions);

  // 2. Agar session nahi mila to sign-in page par bhejo
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // 3. Logged-in user ka ID lo
  const userId = session.user.id;
  const result = await getAllProfiles(Number(userId));
  console.log("SearchProfilePage result:", result);

  if (!result.success) {
    return (
      <div className="min-h-screen bg-orange-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Profiles
          </h1>
          <p className="text-gray-600">{result.message}</p>
        </div>
      </div>
    );
  }

  return (
    <AdmindashboardLayout user={session.user}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link href="/admin" className="text-red-600 hover:underline">
            Dashboard
          </Link>
          <span>/</span>
          <span>Search Matrimonial Profile</span>
        </div>
      </div>
      <SearchProfilesClient initialProfiles={result?.data?.profiles || []} />
    </AdmindashboardLayout>
  );
}
