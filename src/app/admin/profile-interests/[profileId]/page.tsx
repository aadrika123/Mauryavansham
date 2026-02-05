import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import AdmindashboardLayout from '@/src/components/layout/adminDashboardLayout';
import ProfileInterestsPage from './profileInterest';

export default async function ProfileInterestsIndex() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/sign-in');
  }
  console.log('session', session);

  return (
    <AdmindashboardLayout user={session.user}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Interested Profile</h1>
        </div>

        <ProfileInterestsPage user={session.user.id} />
      </div>
    </AdmindashboardLayout>
  );
}
