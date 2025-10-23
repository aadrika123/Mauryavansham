// dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CoachingExperienceCenterRegistration from "@/src/features/coachingAndExperiance/components/CoachingExperienceCenterRegistration";
import DashboardLayout from "@/src/components/layout/dashboardLayout";

export default async function RegisterCoachingIndex() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in");
  }


  return (
    <DashboardLayout user={session.user}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link href="/admin/overview" className="text-red-600 hover:underline">
            Dashboard
          </Link>
          <span>/</span>
          <span>Coaching Registration</span>
        </div>
      </div>
      <CoachingExperienceCenterRegistration />
    </DashboardLayout>
  );
}
