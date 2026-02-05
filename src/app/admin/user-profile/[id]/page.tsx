// app/view-profile/[userId]/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/src/components/layout/dashboardLayout';
// import UserProfilePage from "./update-userProfile";
import { getUserById } from '@/src/features/getUserById/actions/getUserById';
import AdmindashboardLayout from '@/src/components/layout/adminDashboardLayout';
import UserProfilePage from './update-userProfile';

export default async function ViewUserProfile({ params }: { params: Promise<{ id: string }> }) {
  // 1. Session fetch
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  // 2. URL se userId lo (params se) - Next.js 15+ requires await
  const { id } = await params;

  const result = await getUserById(id);
  console.log('Fetched user data:', result);
  console.log('Fetched user data:', session.user);

  return (
    <AdmindashboardLayout user={session.user} data={result.data}>
      <UserProfilePage data={result.data} />
    </AdmindashboardLayout>
  );
}
