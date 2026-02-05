import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/src/lib/auth';
import CreateProfileForm from '@/src/app/dashboard/create-profile/createProfileForm';
import { Crown } from 'lucide-react';

export default async function CreateProfilePage() {
  // Get the session
  const session = await getServerSession(authOptions);

  // If no session, redirect to sign-in
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  return (
    <div className="max-w-full mx-auto bg-orange-50 px-4 py-8">
      <h1 className="text-3xl font-semibold mb-4 text-center text-red-700">
        <Crown className="inline-block mr-2 w-8 h-10" />
        Create Matrimonial Profile
      </h1>
      <CreateProfileForm />
    </div>
  );
}
