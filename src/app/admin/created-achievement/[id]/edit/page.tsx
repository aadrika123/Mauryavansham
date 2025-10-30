import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";
import { db } from "@/src/drizzle/db";
import { achievements } from "@/src/drizzle/schema";
import { eq } from "drizzle-orm";
// import CreateAchievementForm from "@/src/components/forms/CreateAchievementForm";
import AdmindashboardLayout from "@/src/components/layout/adminDashboardLayout";
import CreateAchievementForm from "../../../create-achievement/createAchievementForm";

export default async function EditAchievementPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/sign-in");

  const id = Number(params.id);
  const existing = await db
    .select()
    .from(achievements)
    .where(eq(achievements.id, id))
    .limit(1);

  const achievement = existing[0];
  if (!achievement) {
    redirect("/admin/created-achievement");
  }

  const formatted = {
    id: achievement.id,
    name: achievement.name,
    title: achievement.title,
    description: achievement.description,
    image: achievement.image,
    category: achievement.category,
    isVerified: achievement.isVerified,
    isFeatured: achievement.isFeatured,
    isHallOfFame: achievement.isHallOfFame,
    year: achievement.year,
    location: achievement.location,
    keyAchievement: achievement.keyAchievement,
    impact: achievement.impact,
    achievements: achievement.achievements ?? [],
  };

  return (
    <AdmindashboardLayout user={session.user}>
      <div className="container mx-auto px-6 py-6">
        <h1 className="text-2xl font-bold text-red-700 mb-6">
          Edit Achievement
        </h1>
        <CreateAchievementForm initialData={formatted} />
      </div>
    </AdmindashboardLayout>
  );
}
