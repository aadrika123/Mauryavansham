import { eq, desc } from "drizzle-orm";
import AchievementsClient from "@/src/app/(home)/achievements/achievement-client";
import { achievements } from "@/src/drizzle/schema";
import { db } from "@/src/drizzle/db";

export default async function AchievementsPage() {
  try {
    // ✅ Fetch only active achievements ordered by year (newest first)
    const allAchievements = await db
      .select()
      .from(achievements)
      .where(eq(achievements.status, "active"))
      .orderBy(desc(achievements.year));

    // ✅ Format data for frontend
    const formatted = allAchievements.map((item) => ({
      id: item.id,
      name: item.name,
      fatherName: item.fatherName,
      motherName: item.motherName,
      achievementTitle: item.achievementTitle,
      description: item.description,
      images: item.images || [],
      category: item.category,
      otherCategory: item.otherCategory ?? "",
      isVerified: item.isVerified,
      isFeatured: item.isFeatured,
      isHallOfFame: item.isHallOfFame,
      year: item.year,
      location: item.location,
      keyAchievement: item.keyAchievement,
      impact: item.impact,
      achievements: item.achievements ?? [],
    }));
    console.log(formatted, "formatted");
    return <AchievementsClient initialAchievements={formatted} />;
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load achievements. Please try again later.
      </div>
    );
  }
}
