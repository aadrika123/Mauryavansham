// import { getProfileById } from "@/src/features/searchProfile/actions/getProfileById"
import { notFound, redirect } from 'next/navigation';
// import ProfileDetailView from "./profile-detail-view"
import { getProfileById } from '@/src/features/searchProfile/actions/getProfileById';
import ProfileDetailView from './profileViewDetails';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import AdmindashboardLayout from '@/src/components/layout/adminDashboardLayout';

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const result = await getProfileById(params.id);
  console.log('ProfilePage result:', result);

  if (!result.success || !result.data) {
    notFound();
  }
  const session = await getServerSession(authOptions);

  // 2. Agar session nahi mila to sign-in page par bhejo
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  // 3. Logged-in user ka ID lo
  const userId = session.user.id;

  return (
    <AdmindashboardLayout user={session.user}>
      <ProfileDetailView profile={result.data} />
    </AdmindashboardLayout>
  );
}
