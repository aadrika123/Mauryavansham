// import { db } from "@/src/db";
// import { achievements } from "@/src/db/schema/achievements";
import { eq, desc } from "drizzle-orm"; // ✅ import eq() & desc() here
import AchievementsClient from "@/src/app/(home)/achievements/achievement-client";
import { achievements } from "@/src/drizzle/schema";
import { db } from "@/src/drizzle/db";

export default async function AchievementsPage() {
  try {
    // ✅ Correct Drizzle syntax
    const allAchievements = await db
      .select()
      .from(achievements)
      .where(eq(achievements.status, "active")) // ✅ fixed
      .orderBy(desc(achievements.year));

    const formatted = allAchievements.map((item) => ({
      id: item.id,
      name: item.name,
      title: item.title,
      description: item.description,
      image: item.image,
      category: item.category,
      isVerified: item.isVerified,
      isFeatured: item.isFeatured,
      isHallOfFame: item.isHallOfFame,
      year: item.year,
      location: item.location,
      keyAchievement: item.keyAchievement,
      impact: item.impact,
      achievements: item.achievements ?? [],
    }));

    console.log(formatted, "Formatted Achievements");
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
