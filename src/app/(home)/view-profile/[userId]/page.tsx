// app/view-profile/[userId]/page.tsx

import { getProfileById } from '@/src/features/getProfile/actions/getProfileById';
import ProfileOverview from '@/src/features/getProfile/components/ProfileOverview';

export default async function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  const result = await getProfileById(userId);

  console.log(result, 'geteditprofilebyuser');

  if (!result.success || !result.data) {
    return <div className="p-4 text-red-500">Profile not found.</div>;
  }

  return <ProfileOverview profileData={result.data} />;
}
