import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";
import { getProfileById } from "@/src/features/getProfile/actions/getProfileById";
import { getAllProfiles } from "@/src/features/searchProfile/actions/getAllProfiles";
import DashboardLayout from "@/src/components/layout/dashboardLayout";
import AdminOverviewPage from "./overview/page";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  const userId = session.user.id;

  const profileList = await getAllProfiles(Number(userId));
  console.log("SearchProfilePage result:", profileList?.data);


  return (
    <DashboardLayout user={session.user}>
      
     ""
    </DashboardLayout>
  );
}
