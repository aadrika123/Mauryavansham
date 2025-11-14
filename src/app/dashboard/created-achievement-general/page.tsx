import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AdmindashboardLayout from "@/src/components/layout/adminDashboardLayout";
import AdminAchievementsPage from "./createdAchievementPage";
import { achievements } from "@/src/drizzle/schema";
import { db } from "@/src/drizzle/db";
import { desc } from "drizzle-orm";
import DashboardLayout from "@/src/components/layout/dashboardLayout";

export default async function AdsPage() {
  const session = await getServerSession(authOptions);

  // 🔐 Redirect if not logged in
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // 🟢 Fetch all achievements (no filter, admin sees all)
  const allAchievements = await db
    .select()
    .from(achievements)
    .orderBy(desc(achievements.year));

  // 🧩 Format for UI
  const formatted = allAchievements.map((item) => ({
    id: item.id,
    name: item.name,
    fatherName: item.fatherName,
    motherName: item.motherName,
    achievementTitle: item.achievementTitle,
    description: item.description,
    images: item.images ?? [], // ✅ multiple images (array)
    category: item.category,
    otherCategory: item.otherCategory || "", // ✅ if user entered custom category
    isVerified: item.isVerified,
    isFeatured: item.isFeatured,
    isHallOfFame: item.isHallOfFame,
    status: item.status,
    year: item.year,
    location: item.location,
    keyAchievement: item.keyAchievement,
    impact: item.impact,
    achievements: item.achievements ?? [],
    createdBy: item.createdBy,
    createdAt: item.createdAt ? item.createdAt.toISOString() : undefined,
    removedBy: item.removedBy,
    removedAt: item.removedAt ? item.removedAt.toISOString() : undefined,
    removedById: item.removedById,
    reason: item.reason,
  }));

  console.log(formatted, "🧾 Formatted Admin Achievements");

  // 🧭 Render
  return (
    <DashboardLayout user={session.user}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link href="/dashboard" className="text-red-600 hover:underline">
            Dashboard
          </Link>
          <span>/</span>
          <span>Create Achievement</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <AdminAchievementsPage achievements={formatted} />
      </div>
    </DashboardLayout>
  );
}
