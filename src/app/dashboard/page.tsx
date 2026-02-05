import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Dashboard from './dashboard-view';
import { authOptions } from '@/src/lib/auth';
import DashboardLayout from '@/src/components/layout/dashboardLayout';
import { getUserDashboardData } from '@/src/features/searchProfile/actions/getUserDashboardData';

export default async function DashboardPage() {
  // 1. Session fetch karo
  const session = await getServerSession(authOptions);

  // 2. Agar session nahi mila to sign-in page par bhejo
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  // 3. Logged-in user ka ID lo
  const userId = session.user.id;

  const profileList = await getUserDashboardData(Number(userId));
  console.log('SearchProfilePage result:', profileList?.data);

  // 6. Dashboard ko profile data pass karo
  return (
    <DashboardLayout user={session.user}>
      <Dashboard
        // profileData={result.data}
        profileList={profileList?.data || []}
      />
    </DashboardLayout>
  );
}
