import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/src/lib/auth';
import { db } from '@/src/drizzle/db';
import { achievements } from '@/src/drizzle/schema';
import { eq } from 'drizzle-orm';
import AdmindashboardLayout from '@/src/components/layout/adminDashboardLayout';
// import CreateAchievementForm from "../../../create-achievement-general/createAchievementForm";
import DashboardLayout from '@/src/components/layout/dashboardLayout';
import CreateAchievementForm from '../../../create-achievement-general/createAchievementForm';
// import CreateAchievementForm from "../../../create-achievement/createAchievementForm";

export default async function EditAchievementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: paramId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/sign-in');

  const id = Number(paramId);
  const existing = await db.select().from(achievements).where(eq(achievements.id, id)).limit(1);

  const achievement = existing[0];
  if (!achievement) {
    redirect('/dashboard/created-achievement-general');
  }

  // ✅ Format for editing form
  const formatted = {
    id: achievement.id,
    name: achievement.name,
    fatherName: achievement.fatherName,
    motherName: achievement.motherName,
    achievementTitle: achievement.achievementTitle,
    description: achievement.description,
    images: achievement.images ?? [], // array of up to 3
    category: achievement.category,
    otherCategory: achievement.otherCategory || '',
    isVerified: achievement.isVerified,
    isFeatured: achievement.isFeatured,
    isHallOfFame: achievement.isHallOfFame,
    year: achievement.year,
    location: achievement.location,
    keyAchievement: achievement.keyAchievement,
    impact: achievement.impact,
    achievements: achievement.achievements ?? []
  };

  return (
    <DashboardLayout user={session.user}>
      <div className="container mx-auto px-6 py-6">
        <h1 className="text-2xl font-bold text-red-700 mb-6">Edit Achievement</h1>

        {/* ✅ Pass formatted data to your existing form */}
        <CreateAchievementForm initialData={formatted} />
      </div>
    </DashboardLayout>
  );
}
