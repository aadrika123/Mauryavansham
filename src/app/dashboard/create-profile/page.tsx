import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
// import Dashboard from "./dashboard-view";
import { authOptions } from '@/src/lib/auth';
import { getProfileById } from '@/src/features/getProfile/actions/getProfileById';
import { getAllProfiles } from '@/src/features/searchProfile/actions/getAllProfiles';
import DashboardLayout from '@/src/components/layout/dashboardLayout';
import CreateProfileForm from './createProfileForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  // 1. Session fetch karo
  const session = await getServerSession(authOptions);

  // 2. Agar session nahi mila to sign-in page par bhejo
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  // 3. Logged-in user ka ID lo
  const userId = session.user.id;

  const profileList = await getAllProfiles(Number(userId));
  console.log('SearchProfilePage result:', profileList?.data);

  // 4. Profile data fetch karo
  const result = await getProfileById(userId);

  // 5. Agar profile nahi mila
  // if (!result.success || !result.data) {
  //   return <div className="p-4 text-red-500">Profile not found.</div>;
  // }

  // 6. Dashboard ko profile data pass karo
  return (
    <DashboardLayout user={session.user}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link href="/dashboard" className="text-red-600 hover:underline">
            Dashboard
          </Link>
          <span>/</span>
          <span>Create Matrimonial Profile</span>
        </div>
      </div>
      <CreateProfileForm />
    </DashboardLayout>
  );
}
